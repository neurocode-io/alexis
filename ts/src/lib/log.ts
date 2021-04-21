import pino, { stdTimeFunctions } from 'pino'

import { serverConfig } from '../config'

const log = pino({
  prettyPrint: process.env.NODE_ENV !== 'production',
  timestamp: stdTimeFunctions.isoTime,
  level: serverConfig.logLevel,
})

export default log
