import { loadModel, MODEL_NAME } from './inference'

describe('answering/inference', () => {
  it('should load the model', async () => {
    const resp = await loadModel()

    expect(resp).toEqual({
      backend: 'ONNX',
      calls: 0,
      device: 'CPU',
      duration: 0,
      errors: 0,
      key: MODEL_NAME,
      samples: 0,
      tag: '',
      type: 'MODEL'
    })
  })
})
