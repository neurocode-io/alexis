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
  const key = {
    inputId: 'enc_input_ids',
    attentionMask: 'enc_attention_mask',
    outputStart: 'answer_start_score',
    outputEnd: 'answer_end_score'
  }

  const model = {
    numberType: 'int64',
    xDim: 1,
    yDim: 384
  }

  const [_1, _2, _3, ansStart, ansEnd] = await r.send_command(
    'AI.DAGRUN',
    'TIMEOUT',
    '3000',
    '|>',
    'AI.TENSORSET',
    key.inputId,
    model.numberType,
    model.xDim,
    model.yDim,
    'VALUES',
    encodedIds,
    '|>',
    'AI.TENSORSET',
    key.attentionMask,
    model.numberType,
    model.xDim,
    model.yDim,
    'VALUES',
    attentionMask,
    '|>',
    'AI.MODELRUN',
    MODEL_NAME,
    'INPUTS',
    key.inputId,
    key.attentionMask,
    'OUTPUTS',
    key.outputStart,
    key.outputEnd,
    '|>',
    'AI.TENSORGET',
    key.outputStart,
    'VALUES',
    '|>',
    'AI.TENSORGET',
    key.outputEnd,
    'VALUES'
  )

  return {
    ansStart,
    ansEnd
  }
}

export { loadModel, runInference }
