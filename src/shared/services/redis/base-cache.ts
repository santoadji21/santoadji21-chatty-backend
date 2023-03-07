import { createClient } from 'redis'
import Logger from 'bunyan'
import { config } from '@root/config'

export type RedisClient = ReturnType<typeof createClient>

export abstract class BaseCache {
  client: RedisClient
  logger: Logger

  constructor(cacheName: string) {
    this.client = createClient({
      password: config.REDIS_PASSWORD,
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
    })
    this.logger = config.createLogger(cacheName)
    this.cacheError()
  }

  private cacheError(): void {
    this.client.on('error', (err) => {
      this.logger.error(err)
    })
  }
}
