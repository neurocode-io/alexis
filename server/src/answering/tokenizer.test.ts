import { createTokenizer } from './tokenizer'

describe('answering/tokenizer', () => {
  it('should encode', async () => {
    const t = createTokenizer()
    const encoded = await t.encode('What is your name?', 'My name is Jack')

    expect(encoded.length).toEqual(384)
    expect(encoded.overflowing.length).toEqual(0)
    expect(encoded.attentionMask.length).toEqual(384)
  })

  it('long encodeing', async () => {
    const t = createTokenizer()
    const encoded = await t.encode('What is your name?', 'My name is Jack'.repeat(350))

    expect(encoded.length).toEqual(384)
    expect(encoded.overflowing.length).toEqual(5)
  })

  it('should decode', async () => {
    const t = createTokenizer()

    const encoded = await t.encode('What is your name?', 'My name is Jack')
    const decoded = await t.decode(encoded.ids, 0, 5)

    expect(decoded.trim()).toEqual('What is your name')
  })
})
