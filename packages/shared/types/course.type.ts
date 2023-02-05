import { Types } from 'mongoose'
import type { Progress } from './progress.type.js'

export enum CourseStatus {
	'In Progress',
	'Done',
}

export const courseStatusIndices = [0, 1]

export interface Course {
	_id: string
	owner: string
	name: string
	status: CourseStatus
	archived: boolean
	createdAt: string
	updatedAt: string
	dueCount: number
	isDue: boolean
	order: number
	progressCount: number
}

export interface CourseSchema
	extends Omit<
		Course,
		'_id' | 'owner' | 'dueCount' | 'isDue' | 'progressCount'
	> {
	_id: Types.ObjectId
	owner: Types.ObjectId
}

export interface NewCourse
	extends Omit<
		Course,
		| '_id'
		| 'owner'
		| 'status'
		| 'archived'
		| 'createdAt'
		| 'progresses'
		| 'updatedAt'
		| 'isDue'
		| 'progressCount'
		| 'dueCount'
	> {
	owner: string
}

export type UpdateCourse = Partial<
	Omit<
		Course,
		| '_id'
		| 'owner'
		| 'createdAt'
		| 'progresses'
		| 'updatedAt'
		| 'isDue'
		| 'progressCount'
		| 'dueCount'
	>
>

export interface CourseWithDueProgresses extends Course {
	dueProgresses: Progress[]
}

export interface CourseWithProgress extends Course {
	progresses: Progress[]
}
