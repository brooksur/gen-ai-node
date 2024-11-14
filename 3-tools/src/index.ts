// import { TimeAndOrderAssistant } from './assistants/time-and-order'
import { FlightAssistant } from './assistants/flight-assistant'

// const timeAndOrderAssistant = new TimeAndOrderAssistant()
const flightAssistant = new FlightAssistant()

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim()
  const response = await flightAssistant.completion(userInput)
  console.log(response)
})
