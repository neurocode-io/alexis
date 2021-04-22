import * as env from 'env-var'

const redisConfig = {
  host: env
    .get('REDIS_HOST')
    .required()
    .asString(),
  port: env
    .get('REDIS_PORT')
    .required()
    .asInt(),
  password: env
    .get('REDIS_PASSWORD')
    .required()
    .asString(),
  keyPrefix: env
    .get('REDIS_KEY_PREFIX')
    .default('ax')
    .asString()
}

const serverConfig = {
  port: env
    .get('SERVER_PORT')
    .default(3000)
    .asIntPositive(),
  logLevel: env
    .get('SERVER_LOG_LEVEL')
    .required()
    .asString()
    .toLowerCase()
}

export { redisConfig, serverConfig }
