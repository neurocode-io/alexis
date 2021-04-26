import { promises as fs } from 'fs'
import path from 'path'
import { AddedToken, ByteLevelBPETokenizer, TruncationStrategy } from 'tokenizers'

import { createError } from '../lib/error'
import { errors } from './errors'

let tokenizer: ByteLevelBPETokenizer
const specialTokens = {
  clsToken: '<s>',
  eosToken: '</s>',
  maskToken: new AddedToken('<mask>', true, { leftStrip: true }),
  padToken: '<pad>',
  unkToken: '<unk>'
}

const initTokenizer = async (maxLength: number) => {
  const merges = path.join(__dirname, 'onnx-model', 'merges.txt')
  const vocab = path.join(__dirname, 'onnx-model', 'vocab.json')

  await Promise.all([fs.stat(merges), fs.stat(vocab)]).catch((e) => createError(errors.tokenizerMissingFiles, e))

  tokenizer = await ByteLevelBPETokenizer.fromOptions({
    addPrefixSpace: true,
    mergesFile: merges,
    vocabFile: vocab
  })

  tokenizer.addSpecialTokens(Object.values(specialTokens))
  tokenizer.setPadding({
    maxLength,
    padToken: specialTokens.padToken,
    padId: tokenizer.tokenToId(specialTokens.padToken)
  })
  tokenizer.setTruncation(maxLength, { strategy: TruncationStrategy.OnlySecond })
}

const encode = async (question: string, context: string, maxLength = 512) => {
  if (!tokenizer) await initTokenizer(maxLength)

  return tokenizer.encode(
    `${specialTokens.clsToken}${question}${specialTokens.eosToken}`,
    `${specialTokens.eosToken}${context}${specialTokens.eosToken}`
  )
}

const decode = async (encodingIds: number[], start?: number, end?: number, maxLength = 512) => {
  if (!tokenizer) await initTokenizer(maxLength)

  return tokenizer.decode(encodingIds.slice(start ?? 0, end ?? encodingIds.length))
}

export { decode, encode }
