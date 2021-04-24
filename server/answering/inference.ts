import { promises as fs } from 'fs'
import path from 'path'

import r from '../lib/redis'

type AiOutput = {
  [key: string]: string | number
}

const loadModel = async () => {
  const QAmodel = path.join(__dirname, 'onnx_model', 'ro-optimized-quantized.onnx')
  const qa = await fs.readFile(QAmodel)

  await r.send_command('AI.MODELSET', 'qamodel', 'ONNX', 'CPU', 'BLOB', qa)

  return r.send_command('AI.INFO', 'qamodel') as Promise<AiOutput>
}

const runInference = async (
  encodedIds: number[],
  attentionMask: number[]
): Promise<{ ansStart: number[]; ansEnd: number[] }> => {
  await Promise.all([
    r.send_command('AI.TENSORSET', 'enc_input_ids', 'int64', 1, 512, 'VALUES', encodedIds),
    r.send_command('AI.TENSORSET', 'enc_attention_mask', 'int64', 1, 512, 'VALUES', attentionMask),
  ])

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

  const [ansStart, ansEnd] = await Promise.all([
    r.send_command('AI.TENSORGET', 'enc_answer_start_scores', 'VALUES'),
    r.send_command('AI.TENSORGET', 'enc_answer_end_scores', 'VALUES'),
  ])

  return {
    ansStart,
    ansEnd,
  }
}

export { loadModel, runInference }
