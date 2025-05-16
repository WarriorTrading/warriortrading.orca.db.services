import { app } from './app.js'
import { logger } from './logger.js'
import { initApp } from './init.js'

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', reason => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(async () => {
  await initApp()
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
