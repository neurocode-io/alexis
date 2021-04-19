import pino, { stdTimeFunctions } from 'pino'

const log = pino({
  prettyPrint: process.env.NODE_ENV !== 'production',
  timestamp: stdTimeFunctions.isoTime,
})

export default log
