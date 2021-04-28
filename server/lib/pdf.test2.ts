import * as fs from 'fs'

import { getText } from './pdf'

describe('pdf', () => {
  describe('getText', () => {
    it('should extract text from PDF', () => {
      fs.readFile(`${__dirname}./test-files/book.pdf`, async (err, data) => {
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
        .catch((e) => expect(e).toMatch('error'))
    })
  })
})
