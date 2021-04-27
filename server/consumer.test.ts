import Redis from 'ioredis'

import { redisConfig } from './config'
import { createConsumerGroup, destroyConsumerGroup } from './consumer'

const redis = new Redis()

describe('consumer', () => {
  afterAll(async () => {
    await redis.quit()
  })

  describe('createConsumerGroup', () => {
    beforeAll(async () => {
      await redis.xadd(redisConfig.streamName, '*', 'pageNumber', '0', 'content', '')
    })

    it('should not throw when there is no group', async () => {
      try {
        const disabledGroups = await destroyConsumerGroup()

        expect(disabledGroups).toEqual(0)
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should disable group', async () => {
      await redis.xgroup('CREATE', redisConfig.streamName, redisConfig.consumerGroupName, '0-0')
      try {
        const disabledGroups = await destroyConsumerGroup()

        expect(disabledGroups).toEqual(1)
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
})
