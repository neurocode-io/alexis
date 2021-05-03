import { serverConfig } from '../config'
import log from '../lib/log'
import { arrayToObj, newClient, stream } from '../lib/redis'
import { storePdf } from './store'

const r = newClient()
const processorNumber = process.argv[2] ?? 0
const isConsuming = true
const consumerName = `pdf-processor-${processorNumber}`
const groupName = 'pdf-processor'
const streamName = serverConfig.pdfStream

//these is needed in case the worker crashed the last time and still has something in his pendingList
const lastId = '0-0'
let backLog = true

log.info(`Consumer ${consumerName} starting...`)

const handleInitError = (err: Error) => {
  if (err.message.toLowerCase().includes('busygroup')) return

  throw err
}

const initConsumer = async () => {
  await r.xgroup('CREATE', stream(streamName), groupName, '$', 'MKSTREAM')
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

    //pendingList was empty lets go back and check for new events
    if (entries?.length === 0) {
      backLog = false
      continue
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const payload = Object.fromEntries(entries)
    const id = Object.keys(payload).shift() as string
    const data = arrayToObj(payload[id]) as { fileName: string; userId: string }

    log.info(`Processing ${data.fileName} for user: ${data.userId}`)

    await storePdf(data.fileName, data.userId)

    const ack = await r.xack(stream(streamName), groupName, id)

    //TODO what to do? reprocess? or throw?
    if (ack !== 1) log.warn(`Error acknowledging event ${id}`)
  }
}

start().catch((err) => log.error(err))
