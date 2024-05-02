// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nitro-cloudflare-dev'],
  runtimeConfig: {
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      token: process.env.CLOUDFLARE_API_TOKEN,
    },
    gitlab: {
      apiToken: process.env.GITLAB_API_TOKEN,
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
  },
})
