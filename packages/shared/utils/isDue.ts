import dayjs from 'dayjs'

export function getIsDue(nextDate: string | number) {
	const next = dayjs(nextDate).valueOf()
	const today = dayjs().startOf('day').valueOf()
	return next - today <= 0
}