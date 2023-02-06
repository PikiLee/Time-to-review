import { useCourseStore } from '@/store/course.store'
import { useUserStore } from '@/store/user.store'
import { PROGRESS_URL, type NewProgress, type UpdateProgress } from 'shared'
import { api } from './api'

export async function create(name: string) {
	if (!name) throw Error('Please input name.')
	const userStore = useUserStore()
	if (!userStore.user) throw Error('Please login first.')

	const courseStore = useCourseStore()
	if (!courseStore.currentCourse) throw Error('Can not find course')

	const newProgress: NewProgress = {
		owner: userStore.user._id,
		course: courseStore.currentCourse._id,
		name,
		order: (courseStore.currentCourse.progresses.at(-1)?.order ?? 2000) + 100
	}

	const res = await api.post(PROGRESS_URL, {
		data: newProgress
	})

	courseStore.currentCourse.progresses.push(res.data)
}

export async function update(
	progressId: string,
	updateProgress: UpdateProgress
) {
	const res = await api.put(`${PROGRESS_URL}/${progressId}`, {
		data: updateProgress
	})

	const courseStore = useCourseStore()
	if (!courseStore.currentCourse) throw Error('Can not find course')
	courseStore.replaceProgress(res.data)
	courseStore.currentCourse.progresses.sort((a, b) => a.order - b.order)

	return res.data
}

export async function del(progressId: string) {
	const courseStore = useCourseStore()

	await api.delete(`${PROGRESS_URL}/${progressId}`)

	courseStore.delProgress(progressId)
}
