import { argMax, round, softMax } from '../lib/math'
import { runInference } from './inference'
import { decode, encode } from './tokenizer'

const clean = (answer: string) => {
  const [firstLetter, ...rest] = answer.trim()

  if (!firstLetter) return ''

  return `${firstLetter.toUpperCase()}${rest.join('')}`
}

const getAnswer = async (question: string, context: string) => {
  const encoded = await encode(question, context)
  const { ansStart, ansEnd } = await runInference(encoded.ids, encoded.attentionMask)

  const startProbs = softMax(ansStart)
  const endProbs = softMax(ansEnd)

  const startIdx = argMax(ansStart)
  const endIdx = argMax(ansEnd)

  const score = (startProbs[startIdx] ?? 0) * (endProbs[endIdx] ?? 0)

  const answer = await decode(encoded.ids, startIdx, endIdx + 1)

  return {
    answer: clean(answer),
    score: round(score)
  }
}

export { getAnswer }
