import Redis from 'ioredis'

import { redisConfig } from '../config'

const redis = new Redis(redisConfig)

type AiOutput = {
  [key: string]: string | number
}

export const arrayToObj = (result: unknown[]) => {
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
}

Redis.Command.setReplyTransformer('AI.INFO', arrayToObj)

Redis.Command.setReplyTransformer('JSON.GET', (result: string) => {
  return JSON.parse(result) as unknown
})

export const key = (id: string) => `${redisConfig.namespace}:${id}`
export const idx = (id: string) => key(`idx:${id}`)
export const stream = (id: string) => key(`stream:${id}`)
export const newClient = () => new Redis(redisConfig)

export default redis
