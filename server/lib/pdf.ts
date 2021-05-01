/* eslint-disable import/namespace */
// import * as PDFJS from 'pdfjs-dist'
import * as fileType from 'file-type'
import * as PDFJS from 'pdfjs-dist/es5/build/pdf'

const isPDFfle = async (data: Buffer) => {
  const fileExt = await fileType.fromBuffer(data)

  if (!fileExt?.mime.toLocaleLowerCase().includes('pdf')) {
    return false
  }

  return true
}

async function* getText(data: Buffer) {
  if (!(await isPDFfle(data))) throw new Error('Not a PDF file')

  const pdf = await PDFJS.getDocument({ data }).promise

  const maxPages = pdf.numPages

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i)
    const text = await page.getTextContent()
    const content = text.items.map((item: { str: string }) => item.str).join(' ')

    yield { id: pdf.fingerprint, page: i, content }
  }
}

export { getText }
