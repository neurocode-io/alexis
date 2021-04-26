import fs from 'fs'
import Redis from 'ioredis'

import { redisConfig } from './config'
import log from './lib/log'

const redis = new Redis()
let consumerGruopPromiseResolver: (value?: unknown) => void
let consumerGruopPromise: Promise<unknown>

const createConsumerGroupInternal = async () => {
    const streamExists = (await redis.xlen(redisConfig.streamName)) !== 0

    if (streamExists) {
      try { 
        await redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)
        await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
      } catch {
        setTimeout(createConsumerGroupInternal, 10)

        return
      }

      consumerGruopPromiseResolver()
    } else {
      setTimeout(createConsumerGroupInternal, 10)
    }
  }

export const createConsumerGroup = async () => {
  const awaitConsumerGruopPromise = async () => {
    consumerGruopPromise =
    consumerGruopPromise ||
      new Promise((resolve) => {
        consumerGruopPromiseResolver = resolve
      })

    await consumerGruopPromise
  }

  void createConsumerGroupInternal()

  return awaitConsumerGruopPromise()
}

export const startConsumer = (consumerName: string) => {
  const idFileURI = `${__dirname}/lastID_${consumerName}`

  let lastID: string | undefined
  let checkBacklog: boolean
  let counter = 0

  const start = () => {
    fs.readFile(idFileURI, 'utf8', async (err, data) => {
      if (err || data.length === 0 || !checkBacklog) {
        lastID = '>'
      } else {
        lastID = data
      }

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
        lastID
      )

      console.log(result)
      checkBacklog = result[0]![1].length !== 0
      if (!checkBacklog) {
        setTimeout(start, 10)

        return
      }

      lastID = result[0]![1]![0]![0]
      fs.writeFile(idFileURI, lastID, async (err) => {
        console.log(`last id: ${lastID ? lastID : ''}`)
        if (err) {
          log.error(err)
        }

        const content = result[0]![1]![0]![1]![3]!

        console.log(lastID)
        console.log(content)
        console.log(counter++)

        await redis.xack(redisConfig.streamName, redisConfig.consumerGroupName, lastID as string)

        setTimeout(start, 0)
      })
    })
  }

  start()
}
