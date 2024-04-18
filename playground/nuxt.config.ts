export default defineNuxtConfig({
    devtools: { enabled: true },
    imports: {
        autoImport: false,
    },
    modules: [
        '@remindgmbh/nuxt-typo3',
        '@remindgmbh/nuxt-typo3-solr',
        '@remindgmbh/nuxt-typo3-matomo',
    ],
    typescript: {
        shim: false,
        strict: true,
    },
})
