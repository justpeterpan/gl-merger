import { sendMessages } from '../utils/cf-api'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  console.log(data)

  return data
  // return sendMessages(event, '@cf/meta/llama-3-8b-instruct', [
  //   { role: 'user', content: 'What is the origin of the phrase Hello, World?' },
  // ])
})
