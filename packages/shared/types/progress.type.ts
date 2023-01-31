import {keys, values} from 'lodash-es'

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
	const value = ProgressStageObject[key as (keyof typeof ProgressStageObject)]
	ProgressStageObjectReversed[value] = key as ProgressStageStrings
}

export type ProgressStage =
  typeof ProgressStageObject[keyof typeof ProgressStageObject];
export type ProgressStageStrings = keyof typeof ProgressStageObject;

export const progressStageIndices = values(ProgressStageObject)

export const progressStageInterval = {
	0: 1,
	1: 7,
	2: 14,
	3: 28,
	4: NaN,
}

export interface Progress {
  _id: string;
  course: string;
  owner: string;
  name: string;
  stage: ProgressStage;
  lastDate: string;
  createdAt: string;
  nextDate: string;
  isDue: boolean;
}

export type NewProgress = Omit<Progress, '_id' | 'stage' | 'lastDate' | 'createdAt' | 'nextDate' | 'isDue'> 

export type UpdateProgress = Partial<Omit<Progress, 'course' | 'owner' | 'createdAt'  | 'nextDate' | 'isDue'>>