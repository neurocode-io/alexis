import r, { idx } from '../lib/redis'

const lookUp = (userId: string, searchTerm: string) => {
  return r.send_command(
    'FT.SEARCH',
    idx(userId),
    `@content:${searchTerm}`,
    'SCORER',
    'BM25',
    'WITHSCORES',
    'LIMIT',
    '0',
    '3'
  )
}

export { lookUp }
