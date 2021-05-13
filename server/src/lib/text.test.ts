import { cleanQuestion } from './text'

describe('lib/text', () => {
  describe('cleanQuestion', () => {
    it('should return clean question', () => {
      expect(cleanQuestion('who are you?')).toEqual('are you')
      expect(cleanQuestion('who are you')).toEqual('are you')
      expect(cleanQuestion('are you')).toEqual('are you')
      expect(cleanQuestion('')).toEqual('')
      expect(cleanQuestion('HOW are you there?')).toEqual('are you there')
      expect(cleanQuestion('WhOm are you with?')).toEqual('are you with')
    })
  })
})
