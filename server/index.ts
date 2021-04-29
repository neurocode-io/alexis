import { loadModel } from './answering/inference'
import { app } from './app'
import { Consumer } from './consumer'
import logger from './lib/log'

const consumer = new Consumer()

void consumer.startConsumer()

void loadModel().then(() =>
  app.listen(app.get('port'), () => {
    logger.info('App is running on http://localhost:%d in %s mode', app.get('port'), app.get('env'))
  })
)

process.on('unhandledRejection', (reason, _) => {
  const msg = reason ?? 'Unexpected promise rejection occured'

  logger.error(msg)
})
