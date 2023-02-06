import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

export function getStageString(stage: number, numIntervals: number) {
	const {t} = useI18n()
	if (stage === 0) {
		return t('stages.learned')
	} else if (stage === numIntervals + 1) {
		return t('stages.done')
	} else {
		return t('stages.review',  {count: stage})
	}
}

export function getStartOfDay(rawDate: Date | number | string) {
	const date = dayjs(new Date(rawDate)).startOf('day').toISOString()
	return date
}