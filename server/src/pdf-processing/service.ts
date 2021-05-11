import * as path from 'path'

import { serverConfig } from '../config'
import { getId } from '../lib/pdf'
import r, { stream, userKey } from '../lib/redis'

const startProcessing = async (fileName: string, userId: string) => {
  //TODO check pdfId in userObject
  //JSON.ARRINDEX <key> <path> <json-scalar> [start [stop]]
  //Integer , specifically the position of the scalar value in the array, or -1 if unfound.
  const pdfId = await getId(fileName)
  const streamName = serverConfig.pdfStream

  await r
    .multi([
      ['xadd', stream(streamName), '*', 'fileName', fileName, 'userId', userId],
      [
        'call',
        'JSON.ARRAPPEND',
        userKey(userId),
        '.pdfs',
        JSON.stringify({ id: pdfId, fileName: path.basename(fileName) })
      ]
    ])
    .exec()
}

export { startProcessing }
