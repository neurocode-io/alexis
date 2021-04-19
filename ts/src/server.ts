import { app } from './app'
import logger from './lib/log'

export const server = app.listen(app.get('port'), () => {
  logger.info('App is running on http://localhost:%d in %s mode', app.get('port'), app.get('env'))
})
