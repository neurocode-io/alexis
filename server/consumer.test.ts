import Redis from 'ioredis'

import { redisConfig } from './config'
import { createConsumerGroup, destroyConsumerGroup, startConsumer, stopConsumer } from './consumer'
import { runSafely } from './runSafely'

describe('consumer', () => {
  const redis = new Redis()

  beforeEach(() => {
    console.log('hi')
  })

  afterAll(async () => {
    await redis.flushdb()
    redis.disconnect()
  })

  describe('createConsumerGroup', () => {
    beforeAll(async () => {
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    it('should not throw when there is no group', async () => {
      await runSafely(async () => {
        await expect(destroyConsumerGroup()).resolves.toEqual(0)
      })
    })

    it('should disable group', async () => {
      await runSafely(async () => {
        await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
        await expect(destroyConsumerGroup()).resolves.toEqual(1)
      })
    })
  })

  describe('createConsumerGroup', () => {
    beforeAll(async () => {
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    afterEach(async () => {
      await destroyConsumerGroup()
    })

    it('should create correctly', async () => {
      await runSafely(async () => {
        await createConsumerGroup()
        await expect(redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)).resolves.toEqual(1)
      })
    })

    it('should create one group when multiple createConsumerGroup are called', async () => {
      await runSafely(async () => {
        await createConsumerGroup()
        await createConsumerGroup()
        expect(await destroyConsumerGroup()).toEqual(1)
      })
    })
  })

  describe('startConsumer', () => {
    beforeEach(async () => {
      await runSafely(async () => {
        await stopConsumer()
        await destroyConsumerGroup()
      })
    })

    afterAll(async () => {
      await runSafely(async () => {
        await stopConsumer()
        await destroyConsumerGroup()
      })
    })

    it('should throw when no group was created', async () => {
      try {
        await destroyConsumerGroup()
        await startConsumer()
      } catch (err) {
        expect(err.message).toEqual('no consumer group was created')
      }
    })

    it('should create cnosumers', async () => {
      await runSafely(async () => {
        await createConsumerGroup()
        await startConsumer()
        const info = await redis.xinfo('CONSUMERS', redisConfig.streamName, redisConfig.consumerGroupName)

        expect(info[0]![1]).toEqual('alexisConsumer')
        await stopConsumer()
        await destroyConsumerGroup()
      })
    })
  })
})
