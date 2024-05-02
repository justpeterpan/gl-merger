import { sendMessages } from '../utils/cf-api'

export default defineEventHandler(async (event) => {
  const { projectId, mergeRequestId, data } = await readBody(event)

  const message = await sendMessages(event, '@cf/meta/llama-3-8b-instruct', [
    {
      role: 'system',
      content: 'You are a kind, helpful senior frontend developer.',
    },
    { role: 'user', content: JSON.stringify(data) },
    {
      role: 'system',
      content:
        "Analyze the user's code and provide feedback. Remember to be kind and helpful. Give them a chance to learn and grow. But also be honest and direct. They need to know what they did wrong and how to fix it. But also what they did right. They need to know what they did well and how to do more of it.",
    },
  ])

  const bodyData = JSON.stringify({ body: JSON.stringify(message) })

  await useGitlabApi(event)<unknown[]>(
    `/${projectId}/merge_requests/${mergeRequestId}/discussions`,
    {
      method: 'POST',
      body: bodyData,
    }
  )
})
