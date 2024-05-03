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

  $fetch(config.merja.baseUrl, {
    method: 'POST',
    body: bodyData,
  })

  return {
    status: `Processing started: ${bodyData}, for ${config.merja.baseUrl}`,
  }
})
