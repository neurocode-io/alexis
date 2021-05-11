import * as t from './tokenizer'

describe('answering/tokenizer', () => {
  it('should encode', async () => {
    const encoded = await t.encode('What is your name?', 'My name is Jack')

    expect(encoded.length).toEqual(512)
    expect(encoded.overflowing.length).toEqual(0)
    expect(encoded.attentionMask.length).toEqual(512)
    expect(encoded.attentionMask).toEqual([...Array(13).fill(1), ...Array(499).fill(0)])
  })

  it('long encodeing', async () => {
    const encoded = await t.encode('What is your name?', 'My name is Jack'.repeat(350))

    expect(encoded.length).toEqual(512)
    expect(encoded.overflowing.length).toEqual(3)
  })

  it('should decode', async () => {
    const encoded = await t.encode('What is your name?', 'My name is Jack')
    const decoded = await t.decode(encoded.ids, 0, 5)

    expect(decoded.trim()).toEqual('What is your name')
  })
})
