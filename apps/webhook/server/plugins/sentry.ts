import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { H3Error } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  const {
    public: { sentry },
  } = useRuntimeConfig()

  // If no sentry DSN set, ignore and warn in the console
  if (!sentry.dsn) {
    console.warn('Sentry DSN not set, skipping Sentry initialization')
    return
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentry.dsn,
    environment: sentry.environment,
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Change in production!
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0, // Change in production!
  })

  nitroApp.hooks.hook('error', (error) => {
    Sentry.captureException(error)
  })

  nitroApp.hooks.hook('request', (event) => {
    event.context.$sentry = Sentry
  })

  nitroApp.hooks.hookOnce('close', async () => {
    await Sentry.close(2000)
  })
})
