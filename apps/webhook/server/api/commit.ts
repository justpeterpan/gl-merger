export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { project, object_attributes, object_kind } = await readBody(event)

  if (object_kind !== 'merge_request') {
    return
  }

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.iid

  const bodyData = JSON.stringify({ projectId, mergeRequestId, lastCommitId })

  event.node.res.end('Webhook received and being processed.')

  await $fetch(config.merja.baseUrl, {
    method: 'POST',
    body: bodyData,
  }).catch((err) => {
    console.error('Error processing webhook:', err)
  })

  return {
    status: `Processing started: ${bodyData}, for ${config.merja.baseUrl}`,
  }
})
