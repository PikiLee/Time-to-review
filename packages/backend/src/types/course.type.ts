import type { Progress } from './progress.type'
import { User } from './user.type'

export enum CourseStatus {
  'In Progress',
  'Done',
}

export const courseStatusIndices = [0, 1]

export interface Course {
  _id: number;
  owner: User;
  name: string;
  status: CourseStatus;
  archived: boolean;
  createdAt: string;
  progresses: Progress[];
}

export interface NewCourse extends Omit<Course, '_id' | 'owner' | 'progresses'> {
  owner: string;
}
