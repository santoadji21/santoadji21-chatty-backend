import express, { Express } from 'express'
import { ChattyServer } from '@root/setupServer'
import setupDatabase from '@root/setupDatabase'
import { config } from '@root/config'

class Application {
  public initialize(): Express {
    this.loadConfig()
    setupDatabase()
    const app = express()
    const server = new ChattyServer(app)
    server.start()
    return app
  }

  private loadConfig(): void {
    config.validateConfig()
    config.cludinaryConfig()
  }
}
const app = new Application()
app.initialize()
