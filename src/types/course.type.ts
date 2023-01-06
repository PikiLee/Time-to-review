export enum CourseStatus {
  "In Progress",
  "Done",
}

export interface Course {
  id: number;
  name: string;
  status: CourseStatus;
  archived: boolean;
  createdAt: number;
}
