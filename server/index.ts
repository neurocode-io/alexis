import { initQA } from './answering/qa'
import { app } from './app'
import logger from './lib/log'

void initQA().then(() =>
  app.listen(app.get('port'), () => {
    logger.info('App is running on http://localhost:%d in %s mode', app.get('port'), app.get('env'))
  })
)

process.on('unhandledRejection', (reason, _) => {
  const msg = reason ?? 'Unexpected promise rejection occured'

  logger.error(msg)
})
