import Redis from 'ioredis'

import { redisConfig } from '../config'

const redis = new Redis(redisConfig)

export default redis
