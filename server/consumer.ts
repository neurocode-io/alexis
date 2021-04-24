import fs from 'fs'
import Redis from 'ioredis'

import log from './lib/log'

const redis = new Redis()

export const startConsumer = () => {
  let lastID : string
  let counter = 0

  const start = () => {
    fs.readFile(`${__dirname}/lastID`, 'utf8', async (err, data) => {
        if (err || data.length === 0) {
            lastID = '$'
        } else {
            lastID = data
        }
        
        const result = await redis.xread('BLOCK', '0', 'COUNT', '1', 'STREAMS', 'pdfStream', lastID)

        lastID = result[0]![1]![0]![0]
        fs.writeFile(`${__dirname}/lastID`, lastID, (err) => {
            if (err) {
                log.error(err)
            }
    
            const content = result[0]![1]![0]![1]![3]
    
            console.log(lastID)
            console.log(content)
            console.log(counter++)
        
            setTimeout(start, 0)
        })
    })
  }

  start();
}
