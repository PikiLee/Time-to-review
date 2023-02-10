import { getStartOfDay } from '@/utils/progress.utils'
import { PROGRESS_URL, type NewProgress, type UpdateProgress } from 'shared'
import { api } from './api'
import { keys } from 'lodash-es'

export async function create(newProgress: NewProgress) {
	const res = await api.post(PROGRESS_URL, {
		data: newProgress
	})
	return res.data
}

export async function update(
	progressId: string,
	updateProgress: UpdateProgress
) {
	if (keys(updateProgress).length === 0) return
	if (updateProgress.lastDate)
		updateProgress.lastDate = getStartOfDay(updateProgress.lastDate)

	const res = await api.put(`${PROGRESS_URL}/${progressId}`, {
		data: updateProgress
	})
	return res.data
}

export async function del(progressId: string) {
	return await api.delete(`${PROGRESS_URL}/${progressId}`)
}
