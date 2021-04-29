import * as fs from 'fs'

import { getText } from './pdf'

describe('pdf', () => {
  describe('getText', () => {
    it('should extract text from PDF', () => {
      fs.readFile(`./test-files/EffectiveAggregateDesign.pdf`, async (err, data) => {
        expect(err).toBeNull()
        for await (const obj of getText(data)) {
          expect(obj).toHaveProperty('page')
          expect(obj).toHaveProperty('content')
        }
      })
    })

    it('should not extract from invalid PDF', () => {
      const pdfContent = Buffer.from('hello world')

      getText(pdfContent)
        .next()
        .catch((e: Error) => expect(e.message).toEqual('Not a PDF file'))
    })
  })
})
