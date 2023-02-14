import { useUserStore } from '@/store/user.store'
import { getStartOfDay } from '@/utils/progress.utils'
import { assign } from 'lodash-es'
import { PROGRESS_URL, type NewProgress, type UpdateProgress } from 'shared'
import { api } from './api'

export function withProgressDefaults(name: string, course: string) {
	const userStore = useUserStore()
	if (!userStore.user) throw new Error('Please login first.')

	const DEFAULT_PROGRESS = {
		owner: userStore.user._id,
		stage: 0,
		lastDate: getStartOfDay(Date.now())
	}
	return assign({}, DEFAULT_PROGRESS, { name, course })
}

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

export async function fetchAll(courseId: string) {
	const res = await api.get(`${PROGRESS_URL}/all/${courseId}`)
	return res.data
}
