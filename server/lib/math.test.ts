import { argMax, round, softMax } from './math'

describe('lib/math', () => {
  describe('softMax', () => {
    it('should calculate the softmax', () => {
      const result = softMax([1.0, 2.0, 3.0, 4.0, 1.0, 2.0, 3.0])

      expect(result).toEqual([
        0.02364054302159139,
        0.06426165851049616,
        0.17468129859572226,
        0.47483299974438037,
        0.02364054302159139,
        0.06426165851049616,
        0.17468129859572226
      ])
    })

    it('should throw an error', () => {
      expect(() => softMax([])).toThrowError()
    })
  })

  describe('argMax', () => {
    it('should calculate the argMax', () => {
      const result = argMax([2, 1, 3, 0, -1])
      const result2 = argMax([2, 1])
      const result3 = argMax([])

      expect(result).toEqual(2)
      expect(result2).toEqual(0)
      expect(result3).toEqual(0)
    })
  })

  describe('round', () => {
    it('should round correctly negative numbers', () => {
      const result = round(-0.49123)
      const result2 = round(-0.49523)
      const result3 = round(-0.48523)

      expect(result).toEqual(-0.49)
      expect(result2).toEqual(-0.5)
      expect(result3).toEqual(-0.49)
    })

    it('should round correctly positive numbers', () => {
      const result = round(1.49123)
      const result2 = round(2.49523)
      const result3 = round(3.48523)

      expect(result).toEqual(1.49)
      expect(result2).toEqual(2.5)
      expect(result3).toEqual(3.49)
    })
  })
})
