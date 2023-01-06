export const ProgressStageObject = {
  "Just Learned": 0,
  "Reviewed Once": 1,
  "Reviewed Twice": 2,
  "Reviewed Three Times": 3,
  "Reviewed Fourth Times": 4,
} as const;

export type ProgressStage =
  typeof ProgressStageObject[keyof typeof ProgressStageObject];
export type ProgressStageStrings = keyof typeof ProgressStageObject;

export interface Progress {
  id: number;
  name: string;
  stage: ProgressStage;
  lastDate: number;
}
