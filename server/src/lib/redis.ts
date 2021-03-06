import Redis from 'ioredis'

import { redisConfig } from '../config'

const redis = new Redis(redisConfig)

export function arrayToObj<T>(result: unknown[]): T {
  if (Array.isArray(result)) {
    const obj = {} as T

    for (let i = 0; i < result.length; i += 2) {
      const key = result[parseInt(`${i}`)] as string

      if (typeof key === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        obj[key] = result[i + 1]
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
export const userKey = (id: string) => key(`user:${id}`)
export const newClient = () => new Redis(redisConfig)

export default redis
