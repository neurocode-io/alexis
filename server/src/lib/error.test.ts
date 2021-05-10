/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs'

import { createError } from './error'

describe('lib/error', () => {
  const testError = { code: 7999, name: 'TestError', msg: 'msg', retryable: true }

  it('should be serializable', () => {
    try {
      createError(testError)
    } catch (err) {
      expect(err).toHaveProperty('serialize')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      expect(err.serialize()).toEqual({ error: testError })
    }
  })

  it('should preserve the stack', () => {
    try {
      fs.readFileSync('/does/not/exist')
    } catch (e) {
      try {
        createError(testError, e)
      } catch (e) {
        expect(e.stack).toEqual(expect.stringContaining('ENOENT: no such file or directory'))
      }
    }
  })
})
