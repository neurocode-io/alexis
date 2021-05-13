import { split, Syntax } from 'sentence-splitter'
import log from '../lib/log'
import { argMax, round, softMax } from '../lib/math'
import { isSentence } from '../lib/text'
import { runInference } from './inference'
import { createTokenizer } from './tokenizer'


const MAX_BUFFER_SIZE = 250
const MAX_QUESTION_SIZE = 50
const MAX_PARAGRAPH_SIZE = MAX_BUFFER_SIZE - MAX_QUESTION_SIZE

const getParagraphs = (page: string) => {
  const paragraphs: string[] = []
  let paragraph: string[] = []

  const sentences = split(page)
  .filter((node) => node.type === Syntax.Sentence)
  .filter((sentence) => isSentence(sentence.raw))
  .map((sentence) => sentence.raw)

  for (const sentence of sentences) {
    const words = sentence.split(' ')

    if (words.length + paragraph.length > MAX_PARAGRAPH_SIZE) {
      paragraphs.push(paragraph.join(' ').slice(0))
      paragraph = []
    }

    paragraph = paragraph.concat(words)
  }

  if (paragraph.length) {
    paragraphs.push(paragraph.join(' '))
  }

  return paragraphs
}

const tokenizer = createTokenizer()

const clean = (answer: string) => {
  const [firstLetter, ...rest] = answer.trim()

  if (!firstLetter) return ''

  return `${firstLetter.toUpperCase()}${rest.join('')}`
}

const getAnswer = async (question: string, context: string) => {
  const answers: {
    answer: string
    score: number
  }[] = []


  const inputs = getParagraphs(context)
  for (const input of inputs) {
    const encoded = await tokenizer.encode(question, input)
    const { ansStart, ansEnd } = await runInference(encoded.ids, encoded.attentionMask)
    const startProbs = softMax(ansStart)
    const endProbs = softMax(ansEnd)

    const startIdx = argMax(ansStart)
    const endIdx = argMax(ansEnd)

    let score = (startProbs[startIdx] ?? 0) * (endProbs[endIdx] ?? 0)
    let answer = await tokenizer.decode(encoded.ids, startIdx, endIdx + 1)
    answer.split(' ').length < 48 ? { answer, score } = { answer, score } : { answer, score } = {answer: '', score: 0}
    answers.push({ answer, score })
  }

  log.info(answers)

  const top1 = answers
    .sort((a, b) => {
      if (!a.answer) return 1
      if (!b.answer) return -1

      return b.score - a.score
    })
    .shift()

  return {
    answer: clean(top1?.answer ?? ''),
    score: round(top1?.score ?? 100)
  }
}

export { getAnswer }
