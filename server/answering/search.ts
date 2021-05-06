import r, { arrayToObj, idx } from '../lib/redis'

// function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
//   return value !== null && value !== undefined
// }

const lookUp = async (userId: string, searchTerm: string) => {
  const resp = ((await r.send_command(
    'FT.SEARCH',
    idx(userId),
    `@content:${searchTerm}`,
    'SCORER',
    'BM25',
    'WITHSCORES',
    "SUMMARIZE",
    "LEN",
    "100",
    "FRAGS",
    "3",
    "SEPARATOR",
    "...."
  )) as Array<string | string[]> )
  .find(item => Array.isArray(item)) as Array<string>;
  
  return arrayToObj<{ content: string; fileName: string }>(resp)
}

export { lookUp }
