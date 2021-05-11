import r, { arrayToObj, idx } from '../lib/redis'

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const lookUp = async (userId: string, searchTerm: string) => {
  const resp = (await r.send_command(
    'FT.SEARCH',
    idx(userId),
    `@content:${searchTerm}`,
    'SCORER',
    'BM25',
    'WITHSCORES',
    'LIMIT',
    '0',
    '4'
  )) as Array<string | string[]>

  return resp
    .map((item) => {
      if (!Array.isArray(item)) return

      return arrayToObj<{ content: string; fileName: string }>(item)
    })
    .filter(notEmpty)
}

export { lookUp }
