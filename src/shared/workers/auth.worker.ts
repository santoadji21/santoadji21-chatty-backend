import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'
import { config } from '@root/config'
import { authService } from '@services/db/auth.services'

const logger: Logger = config.createLogger('AuthWorker')

class AuthWorker {
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data
      await authService.createAuthUser(value)
      job.progress(100)
      done(null, { message: 'User added to DB' })
    } catch (error) {
      logger.error(error)
      done(error as Error)
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker()
