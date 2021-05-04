const softMax = (values: number[]): number[] => {
  if (values.length === 0) throw new Error('At least one value expected in the array')

  const max = Math.max(...values)
  const exps = values.map((x) => Math.exp(x - max))
  const expsSum = exps.reduce((a, b) => a + b)

  return exps.map((e) => e / expsSum)
}

const argMax = (values: number[]) =>
  [].reduce.call(
    values,
    (currentIdx, value, idx, old) => (value > (old[currentIdx as number] || 0) ? idx : currentIdx),
    0
  ) as number

const round = (value: number) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#description
  let isNegative = 1

  if (value < 0) {
    isNegative = -1
    value = value * isNegative
  }

  return isNegative * (Math.round((value + Number.EPSILON) * 100) / 100)
}

const numberBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

export { argMax, numberBetween, round, softMax }
