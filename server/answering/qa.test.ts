import { getAnswer, initQA } from './qa'

describe('answering/qa', () => {
  it.skip('should load the model', async () => {
    const resp = await initQA()

    expect(resp).toEqual({
      backend: 'ONNX',
      calls: 0,
      device: 'CPU',
      duration: 0,
      errors: 0,
      key: 'qamodel',
      samples: 0,
      tag: '',
      type: 'MODEL',
    })
  })
  function softMax(values: number[]): number[] {
    const max = Math.max(...values)
    const exps = values.map((x) => Math.exp(x - max))
    const expsSum = exps.reduce((a, b) => a + b)

    return exps.map((e) => e / expsSum)
  }
  it('should work', async () => {
    const { ansStrt, ansEnd } = await getAnswer('Who am I?', 'I am Bobby')

    expect(softMax(ansStrt)).toEqual([])
    expect(softMax(ansEnd)).toEqual([])
  })
})
