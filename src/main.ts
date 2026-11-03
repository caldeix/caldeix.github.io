import './assets/main.css'

import { createApp, unref } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'

const { t, locale } = i18n.global
document.documentElement.lang = unref(locale)
document.title = t('meta.title')
document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))

createApp(App).use(i18n).mount('#app')
