/* eslint-disable @typescript-eslint/no-explicit-any */
import Logger from 'bunyan'
import Queue, { Job } from 'bull'
import { ExpressAdapter, createBullBoard, BullAdapter } from '@bull-board/express'
import { config } from '@root/config'
import { IAuthJob } from '@auth/interfaces/auth.interface'
import { IEmailJob, IUserJob } from '@user/interfaces/user.interface'

type IBaseJobData = IAuthJob | IEmailJob | IUserJob

let bullAdapters: BullAdapter[] = []

export let serverAdapter: ExpressAdapter

export abstract class BaseQueue {
  queue: Queue.Queue
  logger: Logger

  constructor(queueName: string) {
    this.queue = new Queue(queueName, {
      redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
      },
    })
    bullAdapters.push(new BullAdapter(this.queue))
    bullAdapters = [...new Set(bullAdapters)]
    serverAdapter = new ExpressAdapter()
    serverAdapter.setBasePath('/admin/queues')

    createBullBoard({
      queues: bullAdapters,
      serverAdapter,
    })
    this.logger = config.createLogger(`${queueName}Queue`)

    this.queue.on('completed', (job: Job) => {
      job.remove()
    })
    this.queue.on('global:completed', (job) => {
      this.logger.info(`Job ${job.id} completed`)
    })
    this.queue.on('global:stalled', (job) => {
      this.logger.error(`Job ${job.id} is stalled`)
    })
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } })
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback)
  }
}
