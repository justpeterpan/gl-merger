export default defineEventHandler(async (event) => {
  await event.context.cloudflare.env.kv.put(
    `${new Date()} start merja`,
    'start'
  )
  const { projectId, mergeRequestId, lastCommitId } = await readBody(event)

  const data = await useGitlabApi(event)<unknown[]>(
    `/${projectId}/repository/commits/${lastCommitId}/diff`
  )

  await event.context.cloudflare.env.kv.put(
    `{new Date()} data merja`,
    JSON.stringify(data)
  )

  const message = await sendMessages(event, '@cf/meta/llama-3-8b-instruct', [
    {
      role: 'system',
      content: 'You are a kind, helpful senior frontend developer.',
    },
    { role: 'user', content: JSON.stringify(data) },
    {
      role: 'system',
      content:
        'Perform a comprehensive review of the code diff of a commit provided. Evaluate the code for functionality, bug detection, coding standards, and best practices.',
    },
  ])

  const stringifiedMessage = JSON.stringify(message)
  const bodyData = JSON.stringify({ body: stringifiedMessage })

  await useGitlabApi(event)<unknown[]>(
    `/${projectId}/merge_requests/${mergeRequestId}/discussions`,
    {
      method: 'POST',
      body: bodyData,
    }
  )
})
