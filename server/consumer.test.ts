import Redis from 'ioredis'

import { redisConfig } from './config'
import { createConsumerGroup, destroyConsumerGroup, startConsumer, stopConsumer } from './consumer'


describe('consumer', () => {
  const redis = new Redis()

  beforeEach(() => {
    console.log('hi')
  })

  afterAll(async() => {
    await stopConsumer()
    await destroyConsumerGroup()
    redis.disconnect()
  })

  describe('createConsumerGroup', () => {
    beforeAll(async () => {
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    it('should not throw when there is no group', async () => {
      try {
        await expect(destroyConsumerGroup()).resolves.toEqual(0)
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should disable group', async () => {
      try {
        await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
        await expect( destroyConsumerGroup()).resolves.toEqual(1)
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
        await expect(redis.xgroup('DESTROY', redisConfig.streamName, redisConfig.consumerGroupName)).resolves.toEqual(1)
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
    beforeEach(async () => {
      try {
        await destroyConsumerGroup()
      } catch (err) {
        throw new Error(err)
      }
    })

    afterEach(async () => {
      try {
        await stopConsumer()
      } catch (err) {
        throw new Error(err)
      }
    })

    afterAll(async () => {
      try {
        await destroyConsumerGroup()
      } catch (err) {
        throw new Error(err)
      }
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
      try {
        await createConsumerGroup()
        await startConsumer()
        const info = await redis.xinfo('CONSUMERS', redisConfig.streamName, redisConfig.consumerGroupName)

        expect(info[0]![1]).toEqual('alexisConsumer')
        await stopConsumer()
        await destroyConsumerGroup()
      } catch (err) {
        throw new Error(err)
      }
    })
  })
})
