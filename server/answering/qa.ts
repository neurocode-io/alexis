import { promises as fs } from 'fs'
import path from 'path'

import r from '../lib/redis'

type AiOutput = {
  [key: string]: string | number
}

export const initQA = async () => {
  const QAmodel = path.join(__dirname, 'onnx_model', 'ro-optimized-quantized.onnx')
  const qa = await fs.readFile(QAmodel)

  await r.send_command('AI.MODELSET', 'qamodel', 'ONNX', 'CPU', 'BLOB', qa)

  return r.send_command('AI.INFO', 'qamodel') as Promise<AiOutput>
}
