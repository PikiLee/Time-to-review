export enum ProgressStage {
  "Just Learned",
  "Reviewed Once",
  "Reviewed Twice",
  "Reviewed Three Times",
  "Reviewed Fourth Times",
}

export interface Progress {
  id: number;
  name: string;
  stage: ProgressStage;
  lastDate: number;
}
