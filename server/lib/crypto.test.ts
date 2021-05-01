import { decrypt, encrypt } from './crypto'

describe('lib/crypto', () => {
  const key = process.env.USER_ENCRYPTION_KEY ?? 'passwordpasswordpasswordpassword'

  it('should encrypt', () => {
    const encrypted = encrypt('helloWorld', key)

    expect(encrypted)
  })

  it('should decrypt', () => {
    const encrypted = encrypt('helloWorld', key)
    const decrypted = decrypt(encrypted, key)

    expect(decrypted).toEqual('helloWorld')
  })
})
