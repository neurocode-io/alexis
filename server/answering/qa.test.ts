import { initQA } from './qa'

describe('answering/qa', () => {
  it('should load the model', async () => {
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
})
