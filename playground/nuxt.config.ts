export default defineNuxtConfig({
    modules: [
        '@remindgmbh/nuxt-typo3',
        '@remindgmbh/nuxt-typo3-solr',
        '@remindgmbh/nuxt-typo3-matomo',
    ],
    typescript: {
        shim: false,
        strict: true,
    },
    devtools: { enabled: true },
})
