import en from 'dayjs/locale/en'
import zhHans from 'dayjs/locale/zh-cn'
import dayjs from 'dayjs/esm'
import { ref, watch, watchEffect } from 'vue'
import { i18n } from '../i18n'
import { resolveRef, type MaybeComputedRef } from '@vueuse/shared'

const dayjsLocales = {
	en,
	'zh-Hans': zhHans
}

const localeChangedIndicator = ref(true)

watchEffect(() => {
	dayjs.locale(
		dayjsLocales[i18n.global.locale.value as keyof typeof dayjsLocales]
	)
	localeChangedIndicator.value = !localeChangedIndicator.value
})

export { dayjs }

export function useCreatedTime(raw: MaybeComputedRef<string | number | Date>) {
	const time = resolveRef(raw)

	function getCreatedTime() {
		const now = dayjs()
		const created = dayjs(time.value)

		const difference = now.diff(created, 'day')

		if (difference < 7) {
			return created.fromNow()
		} else {
			return created.format('YYYY-MM-DD')
		}
	}

	const createdTime = ref(getCreatedTime())

	watch(
		localeChangedIndicator,
		() => (createdTime.value = getCreatedTime()),
		{ immediate: true }
	)

	return { createdTime }
}
