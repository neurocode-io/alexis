const whQuestions = ['who', 'what', 'how', 'why', 'whom', 'whose', 'where']

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
  text
    .replace(/\s+/g, ' ')
    .replace(/‐ /g, '')
    .replace(/- /g, '')
    .replace(/’/g, `'`)
    .replace(/‘/g, `'`)
    .trim()

const cleanQuestion = (text: string) => {
  if (text.length === 0) return text
  text = text.slice(-1) === '?' ? text.slice(0, -1) : text

  const textArray = text.split(' ')
  const firstWord = textArray[0]
  if (whQuestions.find((element) => element == (firstWord ? firstWord : '').toLowerCase())) {
    textArray.shift()
  }

  return textArray.join(' ')
}

export { cleanText, isSentence, cleanQuestion }
