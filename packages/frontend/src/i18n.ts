import { createI18n } from 'vue-i18n'
import { messages } from 'shared'
import { usePreferredLanguages, useStorage } from '@vueuse/core'
import { watchEffect } from 'vue'

let locale: string
const lang = useStorage('lang', '')
if (lang) {
	locale = lang.value
} else {
	locale = usePreferredLanguages().value[0]
}

export const i18n = createI18n({
	legacy: false,
	locale, // set locale
	fallbackLocale: 'en', // set fallback locale
	messages
})

watchEffect(() => {
	lang.value = i18n.global.locale.value
})

