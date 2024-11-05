import {
    addImportsDir,
    addPlugin,
    createResolver,
    defineNuxtModule,
    hasNuxtModule,
    installModule,
} from '@nuxt/kit'
import { name, version } from '../package.json'
import type { Content } from '@remindgmbh/nuxt-typo3/models/typo3'
import { defu } from 'defu'

export const CONFIG_KEY = 'typo3Matomo'

export interface ModuleOptions {
    cookie?: Content.Cookie['category']
    domains: string
    matomoUrl: string
    siteId: number
}

export default defineNuxtModule<ModuleOptions>({
    defaults: {
        domains: '',
        matomoUrl: '',
        siteId: 0,
    },
    meta: {
        configKey: CONFIG_KEY,
        name,
        version,
    },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        nuxt.options.alias['@remindgmbh/nuxt-typo3-matomo'] =
            resolver.resolve('runtime')

        nuxt.options.runtimeConfig.public[CONFIG_KEY] = defu(
            nuxt.options.runtimeConfig.public[CONFIG_KEY],
            options,
        )

        addImportsDir(resolver.resolve('runtime/composables/**/*'))

        if (nuxt.options._prepare) {
            if (!hasNuxtModule('@remindgmbh/nuxt-typo3')) {
                await installModule('@remindgmbh/nuxt-typo3')
            }
            if (!hasNuxtModule('@remindgmbh/nuxt-typo3-solr')) {
                await installModule('@remindgmbh/nuxt-typo3-solr')
            }
        }

        addPlugin({
            mode: 'client',
            src: resolver.resolve('./runtime/plugins/matomo'),
        })
    },
})
