import { createAdapter } from '@socket.io/redis-adapter'
import Logger from 'bunyan'
import compression from 'compression'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import hpp from 'hpp'
import http from 'http'
import HTTP_STATUS from 'http-status-codes'
import { createClient } from 'redis'
import { Server } from 'socket.io'
import { config } from '@root/config'
import applicationRoutes from '@root/routes'
import { CustomError, IErrorResponse } from '@globals/helpers/error-handler'

const log: Logger = config.createLogger('server')

export class ChattyServer {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.securityMiddleware(this.app)
    this.standardMiddleware(this.app)
    this.routesMiddleware(this.app)
    this.globalErrorHandler(this.app)
    this.startServer(this.app)
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development',
      })
    )

    app.use(hpp())
    app.use(helmet())
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      })
    )
  }

  private standardMiddleware(app: Application): void {
    app.use(compression())
    app.use(
      json({
        limit: '50mb',
      })
    )
    app.use(urlencoded({ extended: true, limit: '50mb' }))
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app)
  }

  private globalErrorHandler(app: Application): void {
    // app.all("*", (req: Request, res: Response) => {
    //   res.status(HTTP_STATUS.NOT_FOUND).json({
    //     status: "error",
    //     statusCode: HTTP_STATUS.NOT_FOUND,
    //     message: "Route not found",
    //   })
    // })

    app.use((err: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.serializeErrors())
      }
      next()
    })
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpserver: http.Server = new http.Server(app)
      const socketIO: Server = await this.createSocketIOServer(httpserver)
      this.socketIOConnections(socketIO)
      this.startHttpServer(httpserver)
    } catch (err) {
      log.error(`Error starting server: ${err}`)
    }
  }

  private async createSocketIOServer(httpserver: http.Server): Promise<Server> {
    const io: Server = new Server(httpserver, {
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: HTTP_STATUS.OK,
      },
    })

    const pubClient = createClient({
      password: config.REDIS_PASSWORD,
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
    })
    const subClient = pubClient.duplicate()
    await Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      io.adapter(createAdapter(pubClient, subClient))
      io.listen(3000)
    })

    return io
  }

  private startHttpServer(httpserver: http.Server): void {
    log.info(`Server has started with process id: ${process.pid}`)
    httpserver.listen(config.SERVER_PORT || 5000, () => {
      log.info(`Server is running on port ${config.SERVER_PORT || 5000} in ${process.env.NODE_ENV} mode`)
    })
  }

  private socketIOConnections(io: Server): void {
    io.on('connection', (socket) => {
      log.info('New client connected')

      socket.on('disconnect', () => {
        log.info('Client disconnected')
      })
    })
  }
}
