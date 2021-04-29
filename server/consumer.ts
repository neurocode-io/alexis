import Redis from 'ioredis'

import { redisConfig } from './config'
import { runSafely } from './runSafely'

export class Consumer {
  private redis = new Redis()
  private destroyResolver: ((value?: unknown) => void) | null
  private consumerStoppedPromiseResolver: ((value?: unknown) => void) | null
  private stopPromise: Promise<unknown> | null
  private consumingStarted = false
  private beingCreated = false

  private manageTimeouts = (callBack: () => Promise<unknown>, timeOutDuration: number, resolver: ((value?: unknown) => void) | null) => {
    if (resolver) {
      resolver()
    } else {
      setTimeout(callBack, timeOutDuration)
    }

    return Promise.resolve()
  }
  
  private streamExists = async () => {
    return (await this.redis.xlen(redisConfig.streamName)) !== 0
  }

  constructor() {
    this.consumerStoppedPromiseResolver = null
    this.destroyResolver = null
    this.stopPromise = null
  }

  destroyConsumerGroup = async () => {
    await this.stopConsumer()
    
    if (this.beingCreated) {
      await new Promise((resolve) => {
        (this.destroyResolver as (value?: unknown) => void) = resolve
      })

      this.destroyResolver = null
    }

    if (await this.streamExists()) {
        return await this.redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)
    }

    return 0
  }

  startConsumer = async () => {
    if (this.consumingStarted) {
      return
    }

    if (await this.streamExists()) {
        await this.redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)
        await this.redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
        // makes sure group was not destroyed meanwhile being created
        if (this.destroyResolver) {
          return this.manageTimeouts(this.startConsumer, 10, this.destroyResolver)
        }
    } else {
      return this.manageTimeouts(this.startConsumer, 10, this.destroyResolver)
    }

    let counter = 0

    this.consumingStarted = true
    const start = async () => {
      await runSafely(async () => {
        const result = await this.redis.xreadgroup(
          'GROUP',
          redisConfig.consumerGroupName,
          redisConfig.consumerName,
          'BLOCK',
          '1000',
          'COUNT',
          '1',
          'STREAMS',
          redisConfig.streamName,
          '>'
        )

        if (!result) {
          return this.manageTimeouts(start, 10, this.consumerStoppedPromiseResolver)
        }

        if (result[0]![1].length === 0) {
          return this.manageTimeouts(start, 10, this.consumerStoppedPromiseResolver)
        }

        const lastID = result[0]![1]![0]![0]

        const content = result[0]![1]![0]![1]![3]!

        console.log(lastID)
        console.log(content)

        if (counter == 5) {
          await this.stopConsumer()
        }

        console.log(counter++)

        await this.redis.xack(redisConfig.streamName, redisConfig.consumerGroupName, lastID as string)

        return this.manageTimeouts(start, 0, this.consumerStoppedPromiseResolver)
      })
    }
    
    return start()
  }

  stopConsumer = () => {
    if (!this.consumingStarted) {
      return
    }

    const stopConsumerInternal = async () => {
      await new Promise((resolve) => {
        this.consumerStoppedPromiseResolver = resolve
      })

      this.consumingStarted = false
      this.consumerStoppedPromiseResolver = null
    }

    this.stopPromise = this.stopPromise || stopConsumerInternal()

    return this.stopPromise
  }
}
