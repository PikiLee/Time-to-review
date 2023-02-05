import { keys, values } from 'lodash-es'
import { Types } from 'mongoose'

export const ProgressStageObject = {
	'Just Learned': 0,
	'Reviewed Once': 1,
	'Reviewed Twice': 2,
	'Reviewed Three Times': 3,
	'Reviewed Fourth Times': 4,
} as const

export const ProgressStageObjectReversed = {} as Record<
	ProgressStage,
	ProgressStageStrings
>

for (const key of keys(ProgressStageObject)) {
	const value = ProgressStageObject[key as keyof typeof ProgressStageObject]
	ProgressStageObjectReversed[value] = key as ProgressStageStrings
}

export type ProgressStage =
	(typeof ProgressStageObject)[keyof typeof ProgressStageObject]
export type ProgressStageStrings = keyof typeof ProgressStageObject

export const progressStageIndices = values(ProgressStageObject)

export const progressStageInterval = {
	0: 1,
	1: 7,
	2: 14,
	3: 28,
	4: NaN,
}

export interface Progress {
	_id: string
	course: string
	owner: string
	name: string
	stage: ProgressStage
	lastDate: string
	createdAt: string
	updatedAt: string
	order: number
	nextDate: string
	isDue: boolean
}

export type NewProgress = Omit<
	Progress,
	| '_id'
	| 'stage'
	| 'lastDate'
	| 'createdAt'
	| 'nextDate'
	| 'isDue'
	| 'updatedAt'
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
	>
>

export interface ProgressSchema
	extends Omit<Progress, 'course' | 'owner' | '_id'> {
	_id: Types.ObjectId
	owner: Types.ObjectId
	course: Types.ObjectId
}
