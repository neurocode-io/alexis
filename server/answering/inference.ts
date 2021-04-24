import { promises as fs } from 'fs'
import path from 'path'

import r from '../lib/redis'

type AiInfoOutput = {
  [key: string]: string | number
}

export const MODEL_NAME = 'ROv1Optimized'

const loadModel = async () => {
  const QAmodel = path.join(__dirname, 'onnx-model', 'ro-optimized.onnx')
  const qa = await fs.readFile(QAmodel)

  await r.send_command('AI.MODELSET', MODEL_NAME, 'ONNX', 'CPU', 'BLOB', qa)

  return r.send_command('AI.INFO', MODEL_NAME) as Promise<AiInfoOutput>
}

const runInference = async (
  encodedIds: number[],
  attentionMask: number[]
): Promise<{ ansStart: number[]; ansEnd: number[] }> => {
  await Promise.all([
    r.send_command('AI.TENSORSET', 'enc_input_ids', 'int64', 1, 512, 'VALUES', encodedIds),
    r.send_command('AI.TENSORSET', 'enc_attention_mask', 'int64', 1, 512, 'VALUES', attentionMask)
  ])

  await r.send_command(
    'AI.MODELRUN',
    MODEL_NAME,
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
    r.send_command('AI.TENSORGET', 'enc_answer_end_scores', 'VALUES')
  ])

  return {
    ansStart,
    ansEnd
  }
}

export { loadModel, runInference }
