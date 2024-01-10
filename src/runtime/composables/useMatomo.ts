export function useMatomo() {
    function enableLinkTracking() {
        window._paq.push(['enableLinkTracking'])
    }

    function setCustomUrl(url: string) {
        window._paq.push(['setCustomUrl', url])
    }

    function setDomains(domains: string[]) {
        window._paq.push(['setDomains', domains])
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
        enableLinkTracking,
        setCustomUrl,
        setDomains,
        setReferrerUrl,
        setSiteId,
        setTrackerUrl,
        trackPageView,
        trackSiteSearch,
    }
}
