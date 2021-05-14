import bcrypt from 'bcrypt'
import * as uuid from 'uuid'

import { createError } from '../lib/error'
import r, { idx, key, userKey } from '../lib/redis'
import { errors } from './errors'
import { User } from './types'

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

const createUser = async (newUser: User) => {
  if (await r.sismember(key('emails'), newUser.email)) createError(errors.emailConflictError)

  const password = newUser.password
  const saltRounds = 8
  const userId = uuid.v4()

  newUser.password = await bcrypt.hash(password, saltRounds)
  newUser.pdfs = [{ id: '', fileName: '' }]

  await createIdx(userId)
  await r
    .multi([
      ['call', 'JSON.SET', userKey(userId), '.', JSON.stringify(newUser)],
      ['sadd', key('emails'), newUser.email],
      ['hmset', idx('email'), newUser.email, userId]
    ])
    .exec()
}

const checkUser = async (email: string, password: string): Promise<string | never> => {
  const userId = await r.hget(idx('email'), email)

  if (!userId) return createError(errors.validationError)

  const userPassword = await r.send_command('JSON.GET', userKey(userId), '.password')

  if (!(await bcrypt.compare(password, userPassword))) createError(errors.validationError)

  return userId
}

const getUser = async (userId: string) => {
  const resp = (await r.send_command('JSON.GET', userKey(userId))) as User
  const { password, ...payload } = resp

  return payload
}

export { checkUser, createIdx, createUser, getUser }
