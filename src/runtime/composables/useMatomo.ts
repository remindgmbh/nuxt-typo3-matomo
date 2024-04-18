import { useState } from '#imports'

export function useMatomo() {
    const isUserOptedOut = useState<boolean>(
        'matomo-isUserOptedOut',
        () => false,
    )

    function enableLinkTracking() {
        window._paq.push(['enableLinkTracking'])
    }

    function forgetUserOptOut() {
        window._paq.push(['forgetUserOptOut'])
        setIsUserOptedOut()
    }

    function optUserOut() {
        window._paq.push(['optUserOut'])
        setIsUserOptedOut()
    }

    function setCustomUrl(url: string) {
        window._paq.push(['setCustomUrl', url])
    }

    function setDomains(domains: string[]) {
        window._paq.push(['setDomains', domains])
    }

    function setIsUserOptedOut() {
        window._paq.push([
            function (this: any) {
                isUserOptedOut.value = this.isUserOptedOut()
            },
        ])
    }

    function setReferrerUrl(url: string) {
        window._paq.push(['setReferrerUrl', url])
    }

    function setSiteId(id: number) {
        window._paq.push(['setSiteId', id])
    }

    function setTrackerUrl(url: string) {
        window._paq.push(['setTrackerUrl', url])
    }

    function trackPageView(title?: string) {
        window._paq.push(['trackPageView', title])
    }

    function trackSiteSearch(
        keyword: string,
        category?: string,
        numberOfResults?: number,
    ) {
        window._paq.push([
            'trackSiteSearch',
            keyword,
            category ?? false,
            numberOfResults ?? false,
        ])
    }

    return {
        isUserOptedOut,

        enableLinkTracking,
        forgetUserOptOut,
        optUserOut,
        setCustomUrl,
        setDomains,
        setIsUserOptedOut,
        setReferrerUrl,
        setSiteId,
        setTrackerUrl,
        trackPageView,
        trackSiteSearch,
    }
}
