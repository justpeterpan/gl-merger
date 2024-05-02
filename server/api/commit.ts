export default defineEventHandler(async (event) => {
  const { project, object_attributes } = await readBody(event)

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.id

  const data = await useGitlabApi(event)<unknown[]>(
    `/${projectId}/repository/commits/${lastCommitId}/diff`
  )

  const body = JSON.stringify(data + '\n' + 'LGTM')

  const response = await useGitlabApi(event)<unknown[]>(
    `/${projectId}/merge_requests/${mergeRequestId}/discussions`,
    {
      method: 'POST',
      body,
    }
  )

  return response
})
