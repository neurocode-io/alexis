import { getAnswer } from './qa'

describe('answering/qa', () => {
  it.skip('should work', async () => {
    const { ansStart, ansEnd } = await getAnswer('Who am I?', 'I am Bobby')

    expect(softMax(ansStart)).toEqual([])
    expect(softMax(ansEnd)).toEqual([])
  })
})
