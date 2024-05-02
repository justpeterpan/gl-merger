export default defineEventHandler(async (event) => {
  const { project, object_attributes, object_kind } = await readBody(event)

  if (object_kind !== 'merge_request') {
    return
  }

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.id

  const data = await useGitlabApi(event)<unknown[]>(
    `/${projectId}/repository/commits/${lastCommitId}/diff`
  )

  const bodyData = JSON.stringify({ body: data + '\n' + 'LGTM' })

  const response = await useGitlabApi(event)<unknown[]>(
    `/${projectId}/merge_requests/${mergeRequestId}/discussions`,
    {
      method: 'POST',
      body: bodyData,
    }
  )

  return response
})
