import Redis from 'ioredis'

import { redisConfig } from './config'
import { createConsumerGroup, destroyConsumerGroup, startConsumer } from './consumer'

const redis = new Redis()

describe('consumer', () => {
  afterAll(async () => {
    await redis.quit()
  })

  beforeEach(() => {
      console.log('hi')
  })

  describe('createConsumerGroup', () => {
    beforeAll(async () => {
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    it('should not throw when there is no group', async () => {
      try {
        expect(await destroyConsumerGroup()).toEqual(0)
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should disable group', async () => {
        try {
        await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
        expect(await destroyConsumerGroup()).toEqual(1)
      } catch (err) {
        throw new Error(err)
      }
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
      try {
        await createConsumerGroup()
        expect(await redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)).toEqual(1)
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should create one group when multiple createConsumerGroup are called', async () => {
      try {
        await createConsumerGroup()
        await createConsumerGroup()
        expect(await destroyConsumerGroup()).toEqual(1)
      } catch (err) {
        throw new Error(err)
      }
    })
  })

  describe('startConsumer', () => {
    it('should throw when no group was created', async () => {
      await destroyConsumerGroup()
      await expect(startConsumer('test')).rejects.toThrowError()
    })

    it('should create cnosumers', async () => {
        try {
        await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
        await startConsumer('test1')
        const info = await redis.xinfo('CONSUMERS', redisConfig.streamName, redisConfig.consumerGroupName)

        console.log(info)
        expect(info[0]![1]).toEqual('test1')
        await destroyConsumerGroup()
      } catch (err) {
        await destroyConsumerGroup()
        throw new Error(err)
      }
    })
  })
})
