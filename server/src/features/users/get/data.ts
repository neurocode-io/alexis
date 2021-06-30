import r, { userKey } from '../../../lib/redis'
import { User } from '../../../entities/user'

const getUser = async (userId: string) => {
  const resp = (await r.send_command('JSON.GET', userKey(userId))) as User
  const { password, ...payload } = resp

  return payload
}

export { getUser }
