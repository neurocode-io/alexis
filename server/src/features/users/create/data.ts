import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import { User } from '../../../entities/user'
import r, { idx, key, userKey } from '../../../lib/redis'

const handleCreateIdxError = (err: Error) => {
  if (err.message.toLowerCase().includes('index already exists')) return

  throw err
}

const userExists = async (email: string) => r.sismember(key('emails'), email)

const createIdx = async (userId: string) => {
  await r
    .send_command(
      'FT.CREATE',
      idx(userId),
      'ON',
      'HASH',
      'PREFIX',
      '1',
      key(`pdfs:${userId}`),
      'SCHEMA',
      'content',
      'TEXT',
      'PHONETIC',
      'dm:en'
    )
    .catch(handleCreateIdxError)
}

const createUser = async (userReq: Partial<User>) => {
  const saltRounds = 8
  const password = await bcrypt.hash(userReq.password, saltRounds)

  const newUser = { ...userReq, id: uuid.v4(), password } as User

  await createIdx(newUser.id)
  await r
    .multi([
      ['call', 'JSON.SET', userKey(newUser.id), '.', JSON.stringify(newUser)],
      ['sadd', key('emails'), newUser.email],
      ['hmset', idx('email'), newUser.email, newUser.id]
    ])
    .exec()
}
export { createUser, userExists }
