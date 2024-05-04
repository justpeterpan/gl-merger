export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { project, object_attributes, object_kind } = await readBody(event)
  // const { projectId, lastCommitId, mergeRequestId } = await readBody(event)

  if (event.context.cloudflare.env.r2) {
    console.log('puuuuuuuuush')
    await event.context.cloudflare.env.r2.put('start', {
      start: 'start processing',
    })
  }

  if (object_kind !== 'merge_request') {
    return
  }

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.iid

  const varsData = `projectId: ${projectId}, mergeRequestId: ${mergeRequestId}, lastCommitId: ${lastCommitId}`
  await event.context.cloudflare.env.r2.put(
    'vars',
    new Blob([varsData], { type: 'text/plain' })
  )

  const bodyData = JSON.stringify({ projectId, mergeRequestId, lastCommitId })

  await event.context.cloudflare.env.r2.put('bodyData', bodyData)

  event.node.res.end('Webhook received and being processed.')

  await event.context.cloudflare.env.r2.put('bodyData', 'running fetch')

  $fetch(config.merja.baseUrl, {
    method: 'POST',
    body: bodyData,
  }).catch((err) => {
    console.error('Error processing webhook:', err)
  })

  // return
})
