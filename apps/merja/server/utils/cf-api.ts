import { H3Event } from 'h3'

interface Response {
  errors?: unknown[]
  messages?: unknown[]
  result?: {
    response: string
  }
  success: boolean
}

function useQuery(event: H3Event) {
  const config = useRuntimeConfig(event)

  return $fetch.create({
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/ai/run`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.cloudflare.token}`,
    },
  })
}

export async function sendMessages(
  event: H3Event,
  modelId: string,
  messages: Array<{ role: 'user' | 'system'; content: string }>
): Promise<string> {
  return event.context.cloudflare.env?.AI
    ? event.context.cloudflare.env.AI.run(modelId, {
        messages,
      }).then((r: { response: string }) => r.response)
    : useQuery(event)<Response>(modelId, {
        body: {
          messages,
        },
      }).then((r) => r.result?.response)
}
