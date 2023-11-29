import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'
import type { ViteConfig } from '@nuxt/schema'

export const CONFIG_KEY = 'typo3Matomo'

export interface ModuleOptions {
    domains: string
    matomoUrl: string
    siteId: number
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name,
        version,
        configKey: CONFIG_KEY,
    },
    defaults: {
        domains: '',
        matomoUrl: '',
        siteId: 0,
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        nuxt.options.runtimeConfig.public[CONFIG_KEY] = defu(
            nuxt.options.runtimeConfig.public[CONFIG_KEY],
            options,
        )

        const viteConfig: ViteConfig = {
            optimizeDeps: {
                include: ['vue-matomo'],
            },
        }

        nuxt.options.vite = defu(viteConfig, nuxt.options.vite)

        addPlugin({
            src: resolver.resolve('./runtime/plugins/matomo'),
            mode: 'client',
        })
    },
})
