import {
    type T3SolrModel,
    computed,
    defineNuxtPlugin,
    useHead,
    useLogger,
    useMatomo,
    useRouter,
    useRuntimeConfig,
    useT3CookieConsent,
    useT3Data,
    useT3DataUtil,
    watch,
} from '#imports'

export default defineNuxtPlugin((nuxt) => {
    const config = useRuntimeConfig().public.typo3Matomo

    const logger = useLogger()

    if (!config.matomoUrl || config.siteId === 0) {
        logger.warn('Matomo disabled: matomoUrl or siteId not configured')
        return
    }

    const { cookieCategories } = useT3CookieConsent()

    const isCookieAccepted = computed(
        () =>
            !config.cookie ||
            config.cookie === 'none' ||
            cookieCategories.value[config.cookie],
    )

    if (isCookieAccepted.value) {
        includeScript()
    } else {
        watch(
            cookieCategories,
            () => {
                if (isCookieAccepted.value) {
                    includeScript()
                }
            },
            { deep: true },
        )
    }

    function includeScript() {
        useHead({
            script: [
                {
                    async: true,
                    src: new URL('matomo.js', config.matomoUrl).href,
                },
            ],
        })
    }

    window._paq = window._paq || []

    const matomo = useMatomo()

    const router = useRouter()

    matomo.setTrackerUrl(new URL('matomo.php', config.matomoUrl).href)
    matomo.setSiteId(config.siteId)
    matomo.setDomains(config.domains.split(','))
    matomo.setIsUserOptedOut()

    function replaceMatomoLinks(el: HTMLElement) {
        const matomoLinks: NodeListOf<HTMLAnchorElement> = el.querySelectorAll(
            'a[href^="t3://matomo"]',
        )
        for (const matomoLink of matomoLinks) {
            const params = new URLSearchParams(matomoLink.search)
            const action = params.get('action')

            const button = document.createElement('button')
            button.type = 'button'
            button.innerHTML = matomoLink.innerHTML
            button.title = matomoLink.title

            switch (action) {
                case 'opt-out':
                    button.addEventListener('click', matomo.optUserOut)
                    break
                case 'opt-in':
                    button.addEventListener('click', matomo.forgetUserOptOut)
                    break
                case 'toggle':
                    button.addEventListener('click', () => {
                        matomo.isUserOptedOut.value
                            ? matomo.forgetUserOptOut()
                            : matomo.optUserOut()
                    })
                    break
            }

            matomoLink.replaceWith(button)
        }
    }

    nuxt.hook('typo3:parseHtml', (el) => {
        if (el.value) {
            replaceMatomoLinks(el.value)
        } else {
            watch(
                el,
                () => {
                    if (el.value) {
                        replaceMatomoLinks(el.value)
                    }
                },
                { once: true },
            )
        }
    })

    router.afterEach((to) => {
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
