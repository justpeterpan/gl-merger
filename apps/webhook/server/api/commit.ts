export default defineEventHandler(async (event) => {
  const { project, object_attributes, object_kind } = await readBody(event)
  // const { projectId, lastCommitId, mergeRequestId } = await readBody(event)

  if (object_kind !== 'merge_request') {
    return
  }

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.iid
  const timestamp = Math.floor(Date.now() / 1000)

  await event.context.cloudflare.env.kv.put('timestamp_projectId', projectId)
  await event.context.cloudflare.env.kv.put('timestamp_lastCommitId', lastCommitId)
  await event.context.cloudflare.env.kv.put('timestamp_mergeRequestId', mergeRequestId)
  await event.context.cloudflare.env.queue.send(timestamp)

  await event.context.cloudflare.env.queue.event.node.res.end(
    'Webhook received and being processed.'
  )
})
