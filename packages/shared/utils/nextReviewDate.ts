import { type ProgressStage } from '../types/progress.type'
import dayjs from 'dayjs'

export function getNextDate(
	lastTime: string | number,
	stage: ProgressStage,
	intervals: number[]
) {
	const lastDate = dayjs(lastTime)
	const nextDate = lastDate.add(intervals[stage], 'day').toISOString()

	return nextDate
}
