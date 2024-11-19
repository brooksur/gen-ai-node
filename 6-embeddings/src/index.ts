import fs from 'fs'
import path from 'path'
import * as embeddings from './embeddings'
import { cosineSimilarity } from './similarity'

interface MovieData {
  title: string
  overview: string
  year: string
  rating: string
  director: string
  genre: string
  runtime: string
  stars: string[]
}

async function loadIMDBData() {
  // Read and parse the CSV file
  const csvData = fs.readFileSync(path.join(__dirname, 'imdb.csv'), 'utf-8')

  const movies: MovieData[] = csvData
    .split('\n')
    .filter((row) => row.length > 0)
    .map((row) => {
      // CSV parsing logic
      const matches = []
      let field = ''
      let inQuotes = false

      for (let i = 0; i < row.length; i++) {
        const char = row[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          matches.push(field.replace(/^"|"$/g, '').trim())
          field = ''
        } else {
          field += char
        }
      }
      // Push the last field
      matches.push(field.replace(/^"|"$/g, '').trim())

      return {
        title: matches[1], // Series_Title
        year: matches[2], // Released_Year
        runtime: matches[4], // Runtime
        genre: matches[5], // Genre
        rating: matches[6], // IMDB_Rating
        overview: matches[7], // Overview
        director: matches[9], // Director
        stars: [
          // Star1-4
          matches[10],
          matches[11],
          matches[12],
          matches[13]
        ].filter((star) => star) // Remove any empty star entries
      }
    })
    .filter((movie) => movie.title && movie.overview) // Remove any invalid entries
    .splice(1) // Remove header row

  // Create rich text descriptions for each movie
  const movieDescriptions = movies.map((movie) => {
    return `Title: ${movie.title}. 
    Released in ${movie.year}. 
    Runtime: ${movie.runtime}. 
    Genre: ${movie.genre}. 
    IMDB Rating: ${movie.rating}. 
    Directed by ${movie.director}. 
    Starring ${movie.stars.join(', ')}. 
    Overview: ${movie.overview}`
  })

  console.log(movies, movieDescriptions)

  // Generate single embedding for each movie's complete description
  const movieEmbeddings = await embeddings.generateEmbeddings(movieDescriptions)

  // Combine the data with the embedding
  const moviesWithEmbeddings = movies.map((movie, index) => ({
    ...movie,
    embedding: movieEmbeddings.data[index].embedding
  }))

  // Save the results
  embeddings.saveJSON(moviesWithEmbeddings, 'imdb-embeddings.json')
  console.log(`Processed ${movies.length} movies with embeddings`)
}

const imdbData = embeddings.loadJSON<(MovieData & { embedding: number[] })[]>(
  'imdb-embeddings.json'
)

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const userInputEmbeddings = await embeddings.generateEmbeddings(userInput)
  const similarities = imdbData
    .map((movie) => ({
      ...movie,
      similarity: cosineSimilarity(
        movie.embedding,
        userInputEmbeddings.data[0].embedding
      )
    }))
    .sort((a, b) => b.similarity - a.similarity)

  const top5 = similarities.slice(0, 5).map((movie) => ({
    title: movie.title,
    year: movie.year,
    runtime: movie.runtime,
    genre: movie.genre,
    rating: movie.rating,
    director: movie.director,
    stars: movie.stars,
    overview: movie.overview
  }))

  console.log(top5)
})
