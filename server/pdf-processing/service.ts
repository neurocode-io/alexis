import { serverConfig } from '../config'
import r, { stream } from '../lib/redis'

const startProcessing = async (fileName: string) => {
  const streamName = serverConfig.pdfStream

  await r.xadd(stream(streamName), '*', 'fileName', fileName)
  // const pdfId = await storePdf(req.file.filename)
  // await createIdx(pdfId)
}

export { startProcessing }
