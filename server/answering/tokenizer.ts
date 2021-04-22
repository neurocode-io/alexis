import { promises as fs } from 'fs'
import path from 'path'
import { ByteLevelBPETokenizer } from 'tokenizers'

import { createError } from '../lib/error'
import { errors } from './errors'

let tokenizer: ByteLevelBPETokenizer

const addSpecialTokens = ['<s>', '</s>']

const initTokenizer = async () => {
  const merges = path.join('./onnx_model', 'merges.txt')
  const vocab = path.join('./onnx_model', 'vocab.json')

  await Promise.all([fs.stat(merges), fs.stat(vocab)]).catch(createError(errors.tokenizerMissingFiles))

  tokenizer = await ByteLevelBPETokenizer.fromOptions({
    addPrefixSpace: true,
    mergesFile: merges,
    vocabFile: vocab,
  })

  tokenizer.addSpecialTokens(addSpecialTokens)
}

const encode = async (question: string, context: string) => {
  if (!tokenizer) await initTokenizer()

  return tokenizer.encode(question, context)
}

export { encode }
