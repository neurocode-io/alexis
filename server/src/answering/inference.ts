import { promises as fs } from 'fs'
import path from 'path'

import { numberBetween } from '../lib/math'
import r, { key } from '../lib/redis'

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
  const inputKey = key(`enc_input_ids`) + `${numberBetween(0, 10000)}`
  const attentionMaskKey = key(`enc_attention_mask`) + `${numberBetween(0, 10000)}`
  const outputStartScore = key(`answer_start_score`) + `${numberBetween(0, 10000)}`
  const outputEndScore = key(`answer_end_score`) + `${numberBetween(0, 10000)}`

  await Promise.all([
    r.send_command('AI.TENSORSET', inputKey, 'int64', 1, 512, 'VALUES', encodedIds),
    r.send_command('AI.TENSORSET', attentionMaskKey, 'int64', 1, 512, 'VALUES', attentionMask)
  ])

  await r.send_command(
    'AI.MODELRUN',
    MODEL_NAME,
    'TIMEOUT',
    3000,
    'INPUTS',
    inputKey,
    attentionMaskKey,
    'OUTPUTS',
    outputStartScore,
    outputEndScore
  )

  const [ansStart, ansEnd] = await Promise.all([
    r.send_command('AI.TENSORGET', outputStartScore, 'VALUES'),
    r.send_command('AI.TENSORGET', outputEndScore, 'VALUES')
  ])

  return {
    ansStart,
    ansEnd
  }
}

export { loadModel, runInference }
