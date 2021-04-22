/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createError } from './error'

describe('lib/error', () => {
  it('should be serializable', () => {
    const testError = { code: 7999, name: 'TestError', msg: 'msg', retryable: true }

    try {
      createError(testError)
    } catch (err) {
      expect(err).toHaveProperty('serialize')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      expect(JSON.parse(err.serialize())).toEqual({ error: testError })
    }
  })
})
