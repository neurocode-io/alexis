/* eslint-disable security/detect-object-injection */
import { runInference } from './inference'
import { encode } from './tokenizer'

function softMax(values: number[]): number[] {
  const max = Math.max(...values)
  const exps = values.map((x) => Math.exp(x - max))
  const expsSum = exps.reduce((a, b) => a + b)

  return exps.map((e) => e / expsSum)
}

function argMax(array: number[]) {
  // eslint-disable-next-line security/detect-object-injection
  return [].reduce.call(array, (m, c, i, arr) => (c > arr[m] ? i : m), 0) as number
}

const getAnswer = async (question: string, context: string) => {
  const encoded = await encode(question, context)

  const { ansStart, ansEnd } = await runInference(encoded.ids, encoded.attentionMask)

  const startProbs = softMax(ansStart)
  const endProbs = softMax(ansEnd)

  const startIdx = argMax(ansStart)
  const endIdx = argMax(ansEnd)

  const probScore = (startProbs[startIdx] ?? 0) * (endProbs[endIdx] ?? 0)

  return {
    startIdx,
    endIdx,
    probScore,
  }
}

export { getAnswer }
