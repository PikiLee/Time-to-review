import { Types } from 'mongoose'

export type ProgressStage = number

export interface Progress {
	_id: string
	type: 'progress'
	course: string
	owner: string
	name: string
	stage: number
	lastDate: string
	createdAt: string
	updatedAt: string
	order: number
	nextDate: string
	isDue: boolean
}

export type NewProgress = Omit<
	Progress,
	'_id' | 'createdAt' | 'nextDate' | 'isDue' | 'updatedAt' | 'type' | 'order'
>

export type UpdateProgress = Partial<
	Omit<
		Progress,
		| '_id'
		| 'course'
		| 'owner'
		| 'createdAt'
		| 'nextDate'
		| 'isDue'
		| 'updatedAt'
		| 'type'
	>
>

export interface ProgressSchema
	extends Omit<
		Progress,
		'course' | 'owner' | '_id' | 'lastDate' | 'nextDate' | 'isDue' | 'type'
	> {
	_id: Types.ObjectId
	owner: Types.ObjectId
	course: Types.ObjectId
	lastDate: Date
}
