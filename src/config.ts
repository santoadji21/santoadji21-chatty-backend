import dotenv from 'dotenv'
import bunyan from 'bunyan'
dotenv.config({})

class Config {
  public readonly SERVER_PORT: number = Number(process.env.SERVER_PORT) || 5000
  public readonly MONGO_URI: string = process.env.MONGO_URI || ''
  public readonly JWT_SECRET: string = process.env.JWT_SECRET || ''
  public readonly NODE_ENV: string = process.env.NODE_ENV || ''
  public readonly SECRET_KEY_ONE: string = process.env.SECRET_KEY_ONE || ''
  public readonly SECRET_KEY_TWO: string = process.env.SECRET_KEY_TWO || ''
  public readonly CLIENT_URL: string = process.env.CLIENT_URL || ''
  public readonly REDIS_HOST: string = process.env.REDIS_HOST || ''
  public readonly REDIS_PORT: number = Number(process.env.REDIS_PORT) || 6379

  constructor() {
    this.SERVER_PORT = this.SERVER_PORT
    this.MONGO_URI = this.MONGO_URI
    this.JWT_SECRET = this.JWT_SECRET
    this.NODE_ENV = this.NODE_ENV.toLowerCase()
    this.SECRET_KEY_ONE = this.SECRET_KEY_ONE
    this.SECRET_KEY_TWO = this.SECRET_KEY_TWO
    this.CLIENT_URL = this.CLIENT_URL
    this.REDIS_HOST = this.REDIS_HOST
    this.REDIS_PORT = this.REDIS_PORT
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' })
  }

  public validateConfig(): void {
    for (const key in this) {
      if (this[key] === '') {
        throw new Error(`Missing config value for ${key}`)
      }
    }
  }
}

export const config: Config = new Config()
