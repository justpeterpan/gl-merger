export default defineEventHandler(async (event) => {
  const { project, object_attributes, object_kind } = await readBody(event)

  if (object_kind !== 'merge_request') {
    return
  }

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id

  const data = await useGitlabApi(event)<unknown[]>(
    `/${projectId}/repository/commits/${lastCommitId}/diff`
  )

  $fetch('/api/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ project, object_attributes, data }),
  })

  return { status: 'Processing started' }
})
