import { createError } from '../lib/error'
import r, { idx, key } from '../lib/redis'
import { errors } from './errors'
import { CreateUserInput } from './types'

const handleError = (err: Error) => {
  if (err.message.toLowerCase().includes('index already exists')) return

  createError(errors.pdfIndexing, err)
}

const createIdx = async (pdfId: string) => {
  await r
    .send_command(
      'FT.CREATE',
      idx(pdfId),
      'ON',
      'HASH',
      'PREFIX',
      '1',
      key(pdfId),
      'SCHEMA',
      'content',
      'TEXT',
      'PHONETIC',
      'dm:en'
    )
    .catch(handleError)
  // TODO add FT.INFO and check percent_indexed : progress of background indexing (1 if complete)
}

const attachPdf = async (userId: string, pdfId: string) => {
  await r.send_command('JSON.ARRAPPEND', key(userId), '.pdfs', JSON.stringify({ id: pdfId }))
}

const createUser = async (userId: string, user: CreateUserInput) => {
  await r.send_command('JSON.SET', key(userId), '.', JSON.stringify(user))
}

const lookUp = async (idx: string, searchTerm: string) => {
  await r.send_command('FT.SEARCH', idx, `@content:${searchTerm}`, 'SCORER', 'BM25', 'WITHSCORES', 'LIMIT', '0', '5')
}

export { attachPdf, createIdx, createUser, lookUp }
