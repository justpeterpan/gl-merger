export default defineEventHandler(async (event) => {
  const { project, object_attributes, object_kind } = await readBody(event)

  if (object_kind !== 'merge_request') return

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.iid

  const data = JSON.stringify({pid: projectId, cid: lastCommitId, mid: mergeRequestId})

  await event.context.cloudflare.env.queue.send(data)
  event.node.res.end('Webhook received and being processed.')
})
