import { promises as fs } from 'fs'
import path from 'path'

import r from '../lib/redis'
import { encode } from './tokenizer'

type AiOutput = {
  [key: string]: string | number
}

export const initQA = async () => {
  const QAmodel = path.join(__dirname, 'onnx_model', 'ro-optimized-quantized.onnx')
  const qa = await fs.readFile(QAmodel)

  await r.send_command('AI.MODELSET', 'qamodel', 'ONNX', 'CPU', 'BLOB', qa)

  return r.send_command('AI.INFO', 'qamodel') as Promise<AiOutput>
}

const getAnswer = async (question: string, context: string) => {
  const encoded = await encode(question, context)

  await r.send_command('AI.TENSORSET', 'enc_input_ids', 'int64', 1, 512, 'VALUES', encoded.ids)
  await r.send_command('AI.TENSORSET', 'enc_attention_mask', 'int64', 1, 512, 'VALUES', encoded.attentionMask)

  await r.send_command(
    'AI.MODELRUN',
    'qamodel',
    'TIMEOUT',
    3000,
    'INPUTS',
    'enc_input_ids',
    'enc_attention_mask',
    'OUTPUTS',
    'enc_answer_start_scores',
    'enc_answer_end_scores'
  )

  const ansStrt = await r.send_command('AI.TENSORGET', 'enc_answer_start_scores', 'VALUES')
  const ansEnd = await r.send_command('AI.TENSORGET', 'enc_answer_end_scores', 'VALUES')

  return {
    ansStrt,
    ansEnd,
  }
}

export { getAnswer }
