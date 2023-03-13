import express, { Express } from 'express'
import { ChattyServer } from '@root/setupServer'
import setupDatabase from '@root/setupDatabase'
import { config } from '@root/config'

class Application {
  public initialize(): void {
    this.loadConfig()
    setupDatabase()
    const app: Express = express()
    const server: ChattyServer = new ChattyServer(app)
    server.start()
  }

  private loadConfig(): void {
    config.validateConfig()
    config.cludinaryConfig()
  }
}

const application: Application = new Application()
application.initialize()
