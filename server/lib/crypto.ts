import { OPENSSL_VERSION_NUMBER } from 'constants'
import crypto from 'crypto'
import * as env from 'env-var'

const ivSize = 16
const algorithm = 'aes256'

// Check for Heartbleed vulnerabilities
if (OPENSSL_VERSION_NUMBER <= 268443727) {
  throw new Error('OpenSSL Version too old')
}

const encrypt = (plaintext: string, encryptionKey?: string) => {
  const key =
    encryptionKey ??
    env
      .get('USER_ENCRYPTION_KEY')
      .required()
      .asString()
  const iv = crypto.randomBytes(ivSize)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')

  encrypted += cipher.final('hex')

  return iv.toString('hex') + encrypted
}

const decrypt = (encrypted: string, encryptionKey?: string) => {
  const key =
    encryptionKey ??
    env
      .get('USER_ENCRYPTION_KEY')
      .required()
      .asString()
  const iv = Buffer.from(encrypted.substring(0, 2 * ivSize), 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)

  let decrypted = decipher.update(encrypted.substring(2 * ivSize), 'hex')

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString('utf8')
}

const compare = (encrypted: string, plaintext: string) => decrypt(encrypted) === plaintext

export { compare, decrypt, encrypt }
