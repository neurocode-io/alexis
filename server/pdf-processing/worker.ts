import { serverConfig } from '../config'
import log from '../lib/log'
import r, { stream } from '../lib/redis'
import sleep from '../lib/sleep'

const handleInitError = (err: Error) => {
  if (err.message.toLowerCase().includes('already exists')) return

  throw err
}

const processorNumber = process.argv[2] ?? 0
const lastId = '0-0'
const isConsuming = true
const consumerName = `pdf-processor-${processorNumber}`
const groupName = 'pdf-processor'
const streamName = serverConfig.pdfStream
let backLog = true

log.info(`Consumer ${consumerName} starting...`)

const initConsumer = async () => {
  await r.xgroup('CREATE', stream(streamName), groupName, '$', 'MKSTREAM')
}

const processor = async (sd: string) => {
  await sleep(100)
  console.log(sd)
  throw new Error('asd')
}

const start = async () => {
  await initConsumer().catch(handleInitError)
  while (isConsuming) {
    let myId = ''

    backLog ? (myId = lastId) : (myId = '>')

    const resp = await r.xreadgroup(
      'GROUP',
      groupName,
      consumerName,
      'COUNT',
      '1',
      'BLOCK',
      '5000',
      'STREAMS',
      stream(streamName),
      myId
    )

    if (!resp) {
      continue
    }

    const obj = Object.fromEntries(resp)
    const entries = obj[stream(streamName)]

    if (entries?.length === 0) {
      backLog = false
      continue
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const payload = Object.fromEntries(entries)
    const id = Object.keys(payload).shift() as string
    const data = Object.fromEntries([payload[id]]) as { fileName: string }

    console.log(data.fileName)
    await processor(data.fileName)
    const ack = await r.xack(stream(streamName), groupName, id)

    //TODO what to do? reprocess? or throw?
    log.warn(`${consumerName}: ${ack === 1 ? 'Acknowledged' : 'Error acknowledging'} processing of pdf ${id}.`)
  }
}

start().catch((err) => log.error(err))
