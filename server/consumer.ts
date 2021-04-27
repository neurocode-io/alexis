import Redis from 'ioredis'

import { redisConfig } from './config'
import log from './lib/log'

const redis = new Redis()
let consumerGruopPromiseResolver: ((value?: unknown) => void) | null
let consumerGruopPromise: Promise<unknown> | null

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
  }

  if (!consumerGruopPromise) {
    void createConsumerGroupInternal()
  }

  consumerGruopPromise = consumerGruopPromise || awaitConsumerGruopPromise()

  return consumerGruopPromise
}

export const destroyConsumerGroup = async () => {
  if (consumerGruopPromiseResolver) {
    consumerGruopPromiseResolver()
  }

  consumerGruopPromiseResolver = null
  consumerGruopPromise = null

  return redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)
}

export const startConsumer = async (consumerName: string) => {
  let checkBacklog: boolean
  let counter = 0

  const start = async () => {
    try {
      const result = await redis.xreadgroup(
        'GROUP',
        redisConfig.consumerGroupName,
        consumerName,
        'BLOCK',
        '0',
        'COUNT',
        '1',
        'STREAMS',
        redisConfig.streamName,
        '>'
      )

      console.log(result)
      checkBacklog = result[0]![1].length !== 0
      if (!checkBacklog) {
        setTimeout(start, 10)

        return
      }

      const lastID = result[0]![1]![0]![0]

      const content = result[0]![1]![0]![1]![3]!

      console.log(lastID)
      console.log(content)
      console.log(counter++)

      await redis.xack(redisConfig.streamName, redisConfig.consumerGroupName, lastID as string)
      setTimeout(start, 0)

      return Promise.resolve()
    } catch (err) {
      log.error(err)

      return Promise.reject(err)
    }
  }

  await start()
}
