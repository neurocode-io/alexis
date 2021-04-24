import Redis from 'ioredis'

const redis = new Redis()

export const startConsumer = async () => {
  let lastID = '$'
  let counter = 0

  const start = async () => {
    const result = await redis.xread('BLOCK', '0', 'COUNT', '1', 'STREAMS', 'pdfStream', lastID)

    lastID = result[0]![1]![0]![0]
    const content = result[0]![1]![0]![1]![3]
    console.log(lastID)
    console.log(content)
    console.log(counter++)

    setTimeout(start, 0)
  }

  setTimeout(start, 0)
}
