import { authRoutes } from '@auth/routes/authRoutes'
import { serverAdapter } from '@services/queues/base.queue'
import { Application } from 'express'

const PREFIX_PATH = '/api/v1'

export default (app: Application) => {
  const routes = () => {
    app.get(`${PREFIX_PATH}/test`, (req, res) => {
      res.send('Hello World!')
    })
    app.use('/admin/queues', serverAdapter.getRouter())
    app.use(PREFIX_PATH, authRoutes.routes())
  }
  routes()
}
