import {
    defineNuxtPlugin,
    useLogger,
    useT3ApiData,
    useRuntimeConfig,
    type T3Model,
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
            const searchResults = getSearchResults()
            if (searchResults) {
                return {
                    keyword: searchResults.data.query ?? '',
                    resultsCount: searchResults.data.count,
                }
            }

            return false
        },
    })
})

function getSearchResults(): T3SolrModel.Typo3.SolrPiResults | undefined {
    const { currentPageData } = useT3ApiData()
    if (currentPageData.value) {
        return Object.values(currentPageData.value.content)
            .flat()
            .find(isSolrPiResults)?.content
    }
}

function isSolrPiResults(
    contentElement: T3Model.Typo3.Content.Element,
): contentElement is T3Model.Typo3.Content.Element<T3SolrModel.Typo3.SolrPiResults> {
    return contentElement.type === 'solr_pi_results'
}
