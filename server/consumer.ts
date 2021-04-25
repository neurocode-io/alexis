import fs from 'fs'
import Redis from 'ioredis'

import log from './lib/log'

const redis = new Redis()
const streamName = 'pdfStream'
let groupName: string

export const createConsumerGroup = async (groupname: string) => {
    await redis.xgroup('DESTROY', streamName, groupName)
    groupName = groupname
    await redis.xgroup('CREATE', streamName, groupName, '0-0', 'MKSTREAM')
}

export const startConsumer = (consumerName: string) => {
  const idFileURI = `${__dirname}/lastID_${consumerName}`
  
  let lastID: string | undefined
  let checkBacklog: boolean
  let counter = 0


  const start = () => {
    fs.readFile(idFileURI, 'utf8', async (err, data) => {
        if (err || data.length  === 0 || !checkBacklog) {
            lastID = '>'
        } else {
            lastID = data
        }
        
        const result = await redis.xreadgroup('GROUP', groupName, consumerName, 'BLOCK', '0', 'COUNT', '1', 'STREAMS', streamName, lastID)
        console.log(result)
        checkBacklog = result[0]![1].length !== 0
        if (!checkBacklog){
            setTimeout(start, 10)

            return
        }
        
        lastID = result[0]![1]![0]![0]
        fs.writeFile(idFileURI, lastID, (err) => {
            console.log(`last id: ${lastID}`)
            if (err) {
                log.error(err)
            }
    
            const content = result[0]![1]![0]![1]![3]!
    
            console.log(lastID)
            console.log(content)
            console.log(counter++)
        
            setTimeout(start, 0)
        })
    })
  }

  start();
}
