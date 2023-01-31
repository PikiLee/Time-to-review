import type { Progress } from './progress.type.js'
import { User } from './user.type.js'

export enum CourseStatus {
  'In Progress',
  'Done',
}

export const courseStatusIndices = [0, 1]

export interface Course {
  _id: string;
  owner: User;
  name: string;
  status: CourseStatus;
  archived: boolean;
  createdAt: string;
  order: number;
  progresses: Progress[];
}

export interface NewCourse extends Omit<Course, '_id' | 'owner' | 'status' | 'archived' | 'createdAt' | 'progresses'> {
  owner: string;
}

export type UpdateCourse =  Partial<Omit<Course, '_id' | 'owner' | 'createdAt' | 'progresses'>>
