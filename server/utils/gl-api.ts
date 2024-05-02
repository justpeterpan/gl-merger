import type { H3Event } from 'h3'

export function useGitlabApi(event: H3Event) {
  const config = useRuntimeConfig(event)

  return $fetch.create({
    baseURL: 'https://gitlab.com/api/v4/projects',
    headers: {
      Authorization: `Bearer ${config.gitlab.apiToken}`,
    },
  })
}
