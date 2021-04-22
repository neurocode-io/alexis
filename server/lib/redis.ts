import Redis from 'ioredis'

import { redisConfig } from '../config'

const redis = new Redis(redisConfig)

type AiOutput = {
  [key: string]: string | number
}

Redis.Command.setReplyTransformer('AI.INFO', (result: unknown[]) => {
  if (Array.isArray(result)) {
    const obj = {} as AiOutput

    for (let i = 0; i < result.length; i += 2) {
      const key = result[parseInt(`${i}`)]

      if (typeof key === 'string') {
        obj[key] = result[i + 1] as string | number
      }
    }

    return obj
  }

  return result
})

export default redis
