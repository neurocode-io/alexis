import Redis from 'ioredis'

import { redisConfig } from './config'
import { Consumer } from './consumer'
import { runSafely } from './runSafely'

describe('consumer', () => {
  const redis = new Redis()
  
  afterAll(async () => {
    await redis.flushall()
  })

  describe('faulty behaviour', () => {
    it('should destry group while gruop being created', async () => {
      const consumer = new Consumer()

      await runSafely(async () => {
        await consumer.startConsumer()
        await expect(consumer.destroyConsumerGroup()).resolves.toEqual(0)
      })
    })
  })

  describe('destroyConsumerGroup', () => {
    beforeAll(async() => {
      await redis.flushall()
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    it('should not throw when there is no group', async () => {
      await runSafely(async () => {
        const consumer = new Consumer()

        await expect(consumer.destroyConsumerGroup()).resolves.toEqual(0)
      })
    })

    it('should destroy group', async () => {
      await runSafely(async () => {
        const consumer = new Consumer()

        await consumer.startConsumer()
        await expect(consumer.destroyConsumerGroup()).resolves.toEqual(1)
      })
    })
  })

  describe('startConsumer', () => {
    beforeAll(async() => {
      await redis.flushall()
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    it('should create cnosumer', async () => {
      await runSafely(async () => {
        const consumer = new Consumer()

        await consumer.startConsumer()
        const info = await redis.xinfo('CONSUMERS', redisConfig.streamName, redisConfig.consumerGroupName)

        expect(info[0]![1]).toEqual('alexisConsumer')
        await expect(consumer.destroyConsumerGroup()).resolves.toEqual(1)
      })
    })

    it('should not throw when cnosumer was already created', async () => {
      await runSafely(async () => {
        const consumer = new Consumer()

        await consumer.startConsumer()
        await consumer.startConsumer()
        await consumer.startConsumer()
        const info = await redis.xinfo('CONSUMERS', redisConfig.streamName, redisConfig.consumerGroupName)

        expect(info[0]![1]).toEqual('alexisConsumer')
        await expect(consumer.destroyConsumerGroup()).resolves.toEqual(1)
      })
    })
  })
})
