import logger from './log'

describe('lib/log', () => {
  it('should log', () => {
    expect(() => logger.debug('hello')).not.toThrowError()
    expect(() => logger.info('hello')).not.toThrowError()
    expect(() => logger.warn('hello')).not.toThrowError()
    expect(() => logger.error('hello')).not.toThrowError()
  })
})
