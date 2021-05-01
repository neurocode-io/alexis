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
  namespace: env
    .get('REDIS_KEY_PREFIX')
    .default('ax')
    .asString(),
  streamName: env
    .get('REDIS_STREAM_NAME')
    .required()
    .asString(),
  consumerGroupName: env
    .get('REDIS_CONSUMER_GROUP_NAME')
    .required()
    .asString(),
  consumerName: env
    .get('REDIS_CONSUMER_NAME')
    .required()
    .asString()
}

const serverConfig = {
  port: env
    .get('SERVER_PORT')
    .default(3000)
    .asPortNumber(),
  logLevel: env
    .get('SERVER_LOG_LEVEL')
    .required()
    .asString()
    .toLowerCase(),
  appName: 'alexis',
  sessionSecret: env
    .get('SERVER_SESSION_SECRET')
    .required()
    .asString(),
  maxPDFSize: env.get('SERVER_MAX_PDF_SIZE').asIntPositive(),
  uploadDestionation: env.get('SERVER_UPLOAD_DIR').asString()
}

export { redisConfig, serverConfig }
