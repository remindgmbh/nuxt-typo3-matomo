import {
    addImportsDir,
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit'
import { name, version } from '../package.json'
import { defu } from 'defu'

export const CONFIG_KEY = 'typo3Matomo'

export interface ModuleOptions {
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
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        nuxt.options.alias['#nuxt-typo3-matomo'] = resolver.resolve('runtime')

        nuxt.options.runtimeConfig.public[CONFIG_KEY] = defu(
            nuxt.options.runtimeConfig.public[CONFIG_KEY],
            options,
        )

        addImportsDir(resolver.resolve('runtime/composables/**/*'))

        addPlugin({
            mode: 'client',
            src: resolver.resolve('./runtime/plugins/matomo'),
        })
    },
})
