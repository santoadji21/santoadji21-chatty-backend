import express, { Express } from 'express'
import { ChattyServer } from './setupServer'
import setupDatabase from './setupDatabase'
import { config } from './config'

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
  }
}
const app = new Application()
app.initialize()
