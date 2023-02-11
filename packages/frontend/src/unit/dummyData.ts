import type { Course, Progress, CourseWithProgress } from 'shared'

export const course1: Course = {
	_id: 'test1',
	type: 'course',
	owner: 'test',
	name: 'test',
	status: 0,
	archived: false,
	intervals: [1, 7, 14, 28],
	createdAt: '2022-1-1',
	updatedAt: '2022-1-1',
	dueCount: 1,
	isDue: true,
	order: 1,
	progressCount: 1
}

export const course2: Course = {
	_id: 'test2',
	type: 'course',
	owner: 'test',
	name: 'test',
	status: 0,
	archived: false,
	intervals: [1, 7, 14, 28],
	createdAt: '2022-1-1',
	updatedAt: '2022-1-1',
	dueCount: 1,
	isDue: true,
	order: 1,
	progressCount: 1
}

export const course3: Course = {
	_id: 'test33',
	type: 'course',
	owner: 'test',
	name: 'test',
	status: 0,
	archived: false,
	intervals: [1, 7, 14, 28],
	createdAt: '2022-1-1',
	updatedAt: '2022-1-1',
	dueCount: 1,
	isDue: true,
	order: 1,
	progressCount: 1
}

export const courses: Course[] = [course1, course2, course3]

export const progress1: Progress = {
	_id: 'test',
	type: 'progress',
	course: 'test',
	owner: 'test',
	name: 'test',
	stage: 0,
	lastDate: '2022-1-2',
	createdAt: 'test',
	updatedAt: 'test',
	order: 0,
	nextDate: 'test',
	isDue: true
}

export const progress2: Progress = {
	_id: 'test2',
	type: 'progress',
	course: 'test',
	owner: 'test',
	name: 'test',
	stage: 0,
	lastDate: '2022-1-2',
	createdAt: 'test',
	updatedAt: 'test',
	order: 0,
	nextDate: 'test',
	isDue: true
}

export const progress3: Progress = {
	_id: 'test3',
	type: 'progress',
	course: 'test',
	owner: 'test',
	name: 'test',
	stage: 0,
	lastDate: '2022-1-2',
	createdAt: 'test',
	updatedAt: 'test',
	order: 0,
	nextDate: 'test',
	isDue: true
}

export const course1WithProgresses: CourseWithProgress = {
	_id: 'test33',
	type: 'course',
	owner: 'test',
	name: 'test',
	status: 0,
	archived: false,
	intervals: [1, 7, 14, 28],
	createdAt: '2022-1-1',
	updatedAt: '2022-1-1',
	dueCount: 1,
	isDue: true,
	order: 1,
	progressCount: 1,
	progresses: [progress1, progress2, progress3]
}
