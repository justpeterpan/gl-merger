import { H3Event } from 'h3'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { project, object_attributes, object_kind } = await readBody(event)
  // const { projectId, lastCommitId, mergeRequestId } = await readBody(event)

  await event.context.cloudflare.env.kv.put(
    `${new Date()} start merger`,
    'start'
  )

  if (object_kind !== 'merge_request') {
    return
  }

  const projectId = project.id
  const lastCommitId = object_attributes.last_commit.id
  const mergeRequestId = object_attributes.iid

  const bodyData = JSON.stringify({ projectId, mergeRequestId, lastCommitId })
  await event.context.cloudflare.env.kv.put(
    `${new Date()} data merger`,
    bodyData
  )

  event.node.res.end('Webhook received and being processed.')

  await event.context.cloudflare.env.kv.put(
    `${new Date()} fetch`,
    'calling fetch'
  )

  callUrl(config.merja.baseUrl, bodyData, event)

  // $fetch(config.merja.baseUrl, {
  //   method: 'POST',
  //   body: bodyData,
  // }).catch((err) => {
  //   event.context.cloudflare.env.kv.put(
  //     `${new Date()} error`,
  //     JSON.stringify(err)
  //   )
  // })

  // return
})

function callUrl(url: string, data: string, event: H3Event) {
  event.context.cloudflare.env.kv.put(
    `${new Date()} inside fetch`,
    `calling fetch ${url}, ${data}`
  )
  $fetch(url, {
    body: data,
  })
}
