import Redis from 'ioredis'

import { redisConfig } from './config'
import log from './lib/log'

const redis = new Redis()
let consumerGruopPromiseResolver: ((value?: unknown) => void) | null
let consumerStoppedPromiseResolver: ((value?: unknown) => void) | null
let consumerGruopPromise: Promise<unknown> | null
let stopPromise: Promise<unknown> | null
let consumingStarted = false

const createConsumerGroupInternal = async () => {
  const streamExists = (await redis.xlen(redisConfig.streamName)) !== 0

  if (streamExists) {
    try {
      await redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)
      await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
      void (consumerGruopPromiseResolver as (value?: unknown) => void)()
    } catch {
      setTimeout(createConsumerGroupInternal, 10)

      return
    }
  } else {
    setTimeout(createConsumerGroupInternal, 10)
  }
}

export const createConsumerGroup = async () => {
  const awaitConsumerGruopPromise = async () => {
    await new Promise((resolve) => {
      consumerGruopPromiseResolver = resolve
    })

    consumerGruopPromiseResolver = null
  }

  if (!consumerGruopPromise) {
    void createConsumerGroupInternal()
  }

  consumerGruopPromise = consumerGruopPromise || awaitConsumerGruopPromise()

  return consumerGruopPromise
}

export const destroyConsumerGroup = async () => {
  await stopConsumer()
  consumerGruopPromiseResolver = null
  consumerGruopPromise = null

  return redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)
}

export const startConsumer = async () => {
  if (!consumerGruopPromise) {
    throw new Error('no consumer group was created')
  }

  let counter = 0

  consumingStarted = true

  const start = async () => {
    try {
      const result = await redis.xreadgroup(
        'GROUP',
        redisConfig.consumerGroupName,
        redisConfig.consumerName,
        'BLOCK',
        '0',
        'COUNT',
        '1',
        'STREAMS',
        redisConfig.streamName,
        '>'
      )
  
      if (result[0]![1].length === 0) {
        return manageConsumerTimeouts(start, 10)
      }

      const lastID = result[0]![1]![0]![0]

      const content = result[0]![1]![0]![1]![3]!

      console.log(lastID)
      console.log(content)

      if(counter == 5) {
        await stopConsumer()
      }

      console.log(counter++)

      await redis.xack(redisConfig.streamName, redisConfig.consumerGroupName, lastID as string)

      return manageConsumerTimeouts(start, 0)

    } catch (err) {
      log.error(err)

      return Promise.reject(err)
    }
  }

  return start()
}

const manageConsumerTimeouts = (callBack: () => Promise<unknown>, timeOutDuration: number) => {
  if (consumerStoppedPromiseResolver) {
    consumerStoppedPromiseResolver()
  } else {
    setTimeout(callBack, timeOutDuration)
  }

  return Promise.resolve()
}

export const stopConsumer = () => {
  if (!consumingStarted) {
    return
  }
  
  const stopConsumerInternal = async () => {
    await new Promise((resolve) => {
      consumerStoppedPromiseResolver = resolve
    })

    consumingStarted = false
    consumerStoppedPromiseResolver = null
  }

  stopPromise = stopPromise || stopConsumerInternal()

  return stopPromise
}
