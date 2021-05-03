import bcrypt from 'bcrypt'
import * as uuid from 'uuid'

import { createError } from '../lib/error'
import r, { idx, key } from '../lib/redis'
import { errors } from './errors'
import { CreateUserInput } from './types'

const handleError = (err: Error) => {
  if (err.message.toLowerCase().includes('index already exists')) return

  createError(errors.pdfIndexing, err)
}

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
    .catch(handleError)
}

const createUser = async (user: CreateUserInput) => {
  if (await r.sismember(key('emails'), user.email)) createError(errors.emailConflictError)

  const password = user.password
  const saltRounds = 8
  const userId = uuid.v4()

  user.password = await bcrypt.hash(password, saltRounds)

  await createIdx(userId)
  await r
    .multi([
      ['call', 'JSON.SET', key(userId), '.', JSON.stringify(user)],
      ['sadd', key('emails'), user.email],
      ['hmset', idx('email'), user.email, userId]
    ])
    .exec()
}

const checkUser = async (email: string, password: string): Promise<string | never> => {
  const userId = await r.hget(idx('email'), email)

  if (!userId) return createError(errors.validationError)

  const userPassword = await r.send_command('JSON.GET', key(userId), '.password')

  if (!(await bcrypt.compare(password, userPassword))) createError(errors.validationError)

  return userId
}

export { checkUser, createIdx, createUser }
