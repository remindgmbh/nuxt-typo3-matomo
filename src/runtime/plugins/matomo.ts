import {
    defineNuxtPlugin,
    useLogger,
    useT3Data,
    useT3DataUtil,
    useRuntimeConfig,
    type T3SolrModel,
} from '#imports'
// @ts-ignore
import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig().public.typo3Matomo
    const logger = useLogger()

    if (!config.matomoUrl || config.siteId === 0) {
        logger.warn('Matomo disabled: matomoUrl or siteId not configured')
        return
    }

    nuxtApp.vueApp.use(VueMatomo, {
        host: config.matomoUrl,
        siteId: config.siteId,
        // No type for $router, see https://github.com/nuxt/nuxt/issues/12737#issuecomment-1397241218
        router: nuxtApp.$router,
        domains: config.domains,
        trackSiteSearch: () => {
            const { currentPageData } = useT3Data()
            if (currentPageData.value) {
                const { findContentElementByType } = useT3DataUtil()
                const searchResults =
                    findContentElementByType<T3SolrModel.Typo3.SolrPiResults>(
                        'solr_pi_results',
                        currentPageData.value,
                    )
                if (searchResults) {
                    return {
                        keyword: searchResults.content.data.query ?? '',
                        resultsCount: searchResults.content.data.count,
                    }
                }
            }

            return false
        },
    })
})
