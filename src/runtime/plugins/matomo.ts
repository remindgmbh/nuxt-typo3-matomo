import {
    defineNuxtPlugin,
    useHead,
    useLogger,
    useRuntimeConfig,
    useRouter,
    useT3Data,
    useT3DataUtil,
    type T3SolrModel,
} from '#imports'
import { useMatomo } from '../composables/useMatomo'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public.typo3Matomo

    const logger = useLogger()

    if (!config.matomoUrl || config.siteId === 0) {
        logger.warn('Matomo disabled: matomoUrl or siteId not configured')
        return
    }

    window._paq = window._paq || []

    const matomo = useMatomo()

    const router = useRouter()

    matomo.setTrackerUrl(new URL('matomo.php', config.matomoUrl).href)
    matomo.setSiteId(config.siteId)
    matomo.setDomains(config.domains.split(','))

    useHead({
        script: [
            {
                src: new URL('matomo.js', config.matomoUrl).href,
                async: true,
                type: 'text/javascript',
            },
        ],
    })

    router.afterEach((to, from) => {
        matomo.setReferrerUrl(window.location.origin + from.fullPath)
        matomo.setCustomUrl(window.location.origin + to.fullPath)

        const { currentPageData } = useT3Data()
        if (currentPageData.value) {
            const { findContentElementByType } = useT3DataUtil()
            const searchResults =
                findContentElementByType<T3SolrModel.Typo3.SolrPiResults>(
                    'solr_pi_results',
                    currentPageData.value,
                )?.content.data
            if (searchResults) {
                matomo.trackSiteSearch(
                    searchResults.query ?? '',
                    undefined,
                    searchResults.count,
                )
                return
            }
        }

        matomo.trackPageView(to.fullPath)
    })
})
