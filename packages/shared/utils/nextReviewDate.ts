import { progressStageInterval } from '../types/progress.type.js'
import {
	type ProgressStage,
	ProgressStageObject,
} from '../types/progress.type.js'
import dayjs from 'dayjs'

export function getNextDate(lastTime: string | number, stage: ProgressStage) {
	const lastDate = dayjs(lastTime)
	const nextDate =
    stage === ProgressStageObject['Reviewed Fourth Times'] ? 'Done': lastDate.add(progressStageInterval[stage], 'day').format('YYYY-MM-DD')

	return nextDate
}