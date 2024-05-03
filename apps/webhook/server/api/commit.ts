export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const sentry = event.context.$sentry

  // const { project, object_attributes, object_kind } = await readBody(event)
  const { projectId, lastCommitId, mergeRequestId } = await readBody(event)

  // if (object_kind !== 'merge_request') {
  //   return
  // }

  // const projectId = project.id
  // const lastCommitId = object_attributes.last_commit.id
  // const mergeRequestId = object_attributes.iid

  const bodyData = JSON.stringify({ projectId, mergeRequestId, lastCommitId })
  sentry.captureMessage('Webhook received and being processed.')

  event.node.res.end('Webhook received and being processed.')

  $fetch(config.merja.baseUrl, {
    method: 'POST',
    body: bodyData,
  }).catch((err) => {
    console.error('Error processing webhook:', err)
  })

  // return
})
