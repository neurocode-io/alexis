import { app } from './app'
import logger from './lib/log'

app.listen(app.get('port'), () => {
  logger.info('App is running on http://localhost:%d in %s mode', app.get('port'), app.get('env'))
})

process.on('unhandledRejection', (reason, _) => {
  const msg = reason ?? 'Unexpected promise rejection occured'

  logger.error(msg)
})
