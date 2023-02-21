import { Application } from 'express'

export default (app: Application) => {
  const routes = () => {
    app.get('/test', (req, res) => {
      res.send('Hello World!')
    })
  }
  routes()
}
