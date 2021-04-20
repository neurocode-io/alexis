import { getText } from './pdf'
import * as fs from 'fs'

describe('pdf', () => {
  describe('getText', () => {
    it('should extract text from PDF', async () => {
      const pdfContent = fs.readFileSync('./test-files/book.pdf')

      for await (const obj of getText(pdfContent)) {
        expect(obj).toHaveProperty('page')
        expect(obj).toHaveProperty('content')
      }
    })
  })
})
