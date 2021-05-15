import log from '../lib/log'
import { cleanQuestion } from '../lib/text'
import { getAnswer } from './qa'
import { lookUp } from './search'

const TOP_K = 3

const answerService = async (userId: string, question: string) => {
  const resp = await lookUp(userId, cleanQuestion(question))

  if (resp.length === 0) {
    return { result: [{ score: 100, answer: '' }] }
  }

  log.debug(resp)

  const result = await Promise.all(
    resp.map(({ content }) => {
      log.debug(content)
      log.debug('content finished')

      return getAnswer(question, content)
    })
  )

  const cleaned = result
    .filter((r) => r.answer.length > 0)
    .sort((a, b) => {
      if (!a.answer) return 1
      if (!b.answer) return -1

      return b.score - a.score
    })
    //removeDuplicates
    .filter((thing, idx, self) => idx === self.findIndex((t) => t.answer === thing.answer && t.score === thing.score))

  if (cleaned.length === 0) {
    return { result: [{ score: 100, answer: '' }] }
  }

  return { result: cleaned.splice(0, TOP_K) }
}

export { answerService }
