// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/ui', '@nuxtjs/seo'],
  colorMode: {
    preference: 'light',
  },
  app: {
    head: {
      titleTemplate: '%s',
    },
  },
});
