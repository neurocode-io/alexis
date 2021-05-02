import { serverConfig } from '../config'
import r, { stream } from '../lib/redis'

const startProcessing = async (fileName: string, userId: string) => {
  const streamName = serverConfig.pdfStream

  await r.xadd(stream(streamName), '*', 'fileName', fileName, 'user', userId)
}

export { startProcessing }
