import * as dotenv from 'dotenv'


dotenv.config({ path: '.env' })
export const config = {
    SERVICE_NAME: process.env.npm_package_name,
    SERVICE_VERSION: process.env.npm_package_version,
    PORT: process.env.ALEXIS_PORT ?? 3000,
    REDIS_URL: process.env.ALEXIS_REDIS_URL ?? 'redis://localhost:6379/0'
  }
  