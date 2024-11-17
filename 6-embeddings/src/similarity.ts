export function dotProduct(a: number[], b: number[]) {
  const result = a.map((value, index) => {
    return value * b[index]
  })
  return result.reduce((sum, value) => sum + value, 0)
}

export function cosineSimilarity(a: number[], b: number[]) {
  const dotProductValue = dotProduct(a, b)
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0))
  return dotProductValue / (magnitudeA * magnitudeB)
}
