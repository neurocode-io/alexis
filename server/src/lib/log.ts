import pino, { stdTimeFunctions } from 'pino'

import { serverConfig } from '../config'

const log = pino({
  redact: process.env.NODE_ENV === 'production' ? ['password', 'newStack', 'stack'] : [],
  prettyPrint: process.env.NODE_ENV !== 'production',
  timestamp: stdTimeFunctions.isoTime,
  level: serverConfig.logLevel,
  formatters: {
    level: (label: string) => ({ level: label })
  }
})

export default log
