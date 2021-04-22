import r from '../lib/redis'

const initQA = async () => {
  await r.send_command('AI.MODELSET', 'asd')
}
