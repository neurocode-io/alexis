import { app } from './app'
import { startConsumer } from './consumer'
import logger from './lib/log'

startConsumer();

app.listen(app.get('port'), () => {
  logger.info('App is running on http://localhost:%d in %s mode', app.get('port'), app.get('env'))
})

process.on('unhandledRejection', (reason, _) => {
  const msg = reason ?? 'Unexpected promise rejection occured'

  logger.error(msg)
})
