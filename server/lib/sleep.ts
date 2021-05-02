import { promisify } from 'util'

const sleep = async (ms: number) => promisify(setTimeout)(ms)

export default sleep
