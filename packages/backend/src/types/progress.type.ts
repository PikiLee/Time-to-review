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

for (const [key, value] of Object.entries(ProgressStageObject)) {
	ProgressStageObjectReversed[value] = key as ProgressStageStrings
}

export type ProgressStage =
  typeof ProgressStageObject[keyof typeof ProgressStageObject];
export type ProgressStageStrings = keyof typeof ProgressStageObject;

export const progressStageIndices = Object.values(ProgressStageObject)

export interface Progress {
  _id: string;
  course: string;
  owner: string;
  name: string;
  stage: ProgressStage;
  lastDate: string;
  createdAt: string;
}

export type NewProgress = Omit<Progress, '_id' | 'stage' | 'lastDate' | 'createdAt'> 

export type UpdateProgress = Partial<Omit<Progress, 'course' | 'owner' | 'createdAt' >>