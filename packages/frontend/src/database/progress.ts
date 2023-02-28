import { getStartOfDay } from '@/utils/progress.utils'
import type { NewProgress, UpdateProgress } from 'shared'
import { api } from './api'

export async function create(courseId: string, newProgress: NewProgress) {
	if (newProgress.lastDate)
		newProgress.lastDate = getStartOfDay(newProgress.lastDate)
	return api.createProgress(newProgress, {
		params: {
			courseId
		}
	})
}

export async function update(
	courseId: string,
	progressId: string,
	updateProgress: UpdateProgress
) {
	if (updateProgress.lastDate)
		updateProgress.lastDate = getStartOfDay(updateProgress.lastDate)

	return api.updateProgress(updateProgress, {
		params: {
			courseId,
			progressId
		}
	})
}

export async function del(courseId: string, progressId: string) {
	return await api.deleteProgress(undefined, {
		params: {
			courseId,
			progressId
		}
	})
}

export async function fetch(courseId: string, progressId: string) {
	return await api.getProgress({
		params: {
			courseId,
			progressId
		}
	})
}

export async function fetchAll(courseId: string) {
	return await api.getAllProgress({
		params: {
			courseId
		}
	})
}

export async function fetchAllDue(courseId: string) {
	return await api.getAllProgress({
		params: {
			courseId
		},
		queries: {
			isDue: true
		}
	})
}

export async function search(courseId: string, phrase: string) {
	return await api.getAllProgress({
		params: {
			courseId
		},
		queries: {
			search: phrase
		}
	})
}

export async function searchAll(phrase: string) {
	return await api.getAllProgress({
		params: {
			courseId: '1'.repeat(24)
		},
		queries: {
			search: phrase,
			searchAll: true
		}
	})
}
