const isSentence = (sentence: string) => {
  const words = sentence.split(' ')

  if (words.length < 3) return false
  if (words.length > 50) return false

  // cinst allFoundCharacters = sentence.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);

  const isNumber = (char: string) => Number.isFinite(+char)

  const numberOfWordsWithDigits = words.map((word) => [...word].some(isNumber)).filter((s) => s).length

  // are 40% of the words in the sentence with digits
  return numberOfWordsWithDigits / words.length >= 0.4 ? false : true
}

//remove any whitespace symbols: spaces, tabs, and line breaks
const cleanText = (text: string) =>
  text.replace(/\s+/g, ' ').trim().replace(/‐ /g, '').replace(/- /g, '').replace(/’/g, `'`)

export { cleanText, isSentence }
