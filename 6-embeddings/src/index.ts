import fs from 'fs'
import path from 'path'
import * as embeddings from './embeddings'

async function loadIMDBData() {
  // Read and parse the CSV file
  const csvData = fs.readFileSync(path.join(__dirname, 'imdb.csv'), 'utf-8')
  console.log(csvData)
  const rows = csvData
    .split('\n')
    .filter((row) => row.length > 0)
    .map((row) => {
      // Parse CSV while handling quoted fields correctly
      const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
      if (!matches) return null
      return matches.map((val) => val.replace(/^"|"$/g, ''))
    })
    .filter((row) => row !== null)

  // Create simplified data structure with just title and overview
  const movieData = rows.map((row) => {
    return `${row[1]}: ${row[7]}`
  })

  return movieData
}

async function main() {
  const imdbData = await loadIMDBData()
  const imdbEmbeddings = await embeddings.generateEmbeddings(imdbData)
  console.log(imdbEmbeddings)
}

main()
