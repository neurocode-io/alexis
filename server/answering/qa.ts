import { runInference } from './inference'
import { decode, encode } from './tokenizer'

const softMax = (values: number[]): number[] => {
  const max = Math.max(...values)
  const exps = values.map((x) => Math.exp(x - max))
  const expsSum = exps.reduce((a, b) => a + b)

  return exps.map((e) => e / expsSum)
}

const argMax = (array: number[]) =>
  [].reduce.call(array, (m, c, i, arr) => (c > (arr[m as number] || 0) ? i : m), 0) as number

const clean = (answer: string) => {
  const [firstLetter, ...rest] = answer.trim()

  return `${firstLetter?.toUpperCase()}${rest.join('')}`
}

const getAnswer = async (question: string, context: string) => {
  const encoded = await encode(question, context)

  const { ansStart, ansEnd } = await runInference(encoded.ids, encoded.attentionMask)

  const startProbs = softMax(ansStart)
  const endProbs = softMax(ansEnd)

  const startIdx = argMax(ansStart)
  const endIdx = argMax(ansEnd)

  const probScore = (startProbs[startIdx] ?? 0) * (endProbs[endIdx] ?? 0)

  const answer = await decode(encoded.ids, startIdx, endIdx + 1)

  return {
    answer: clean(answer),
    probScore: Math.round((probScore + Number.EPSILON) * 100) / 100,
  }
}

export { getAnswer }
