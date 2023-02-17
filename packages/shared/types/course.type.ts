import { Types } from 'mongoose'
import z from 'zod'

export enum CourseStatus {
	'In Progress',
	'Done'
}
export const courseStatus = z.nativeEnum(CourseStatus)

export const courseZodSchema = z.object({
	_id: z.string(),
	type: z.literal('course'),
	owner: z.string(),
	name: z.string(),
	status: courseStatus,
	archived: z.boolean(),
	intervals: z.array(z.number().gte(1)),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	dueCount: z.number().nonnegative(),
	isDue: z.boolean(),
	order: z.number().nonnegative(),
	progressCount: z.number().nonnegative()
})

export const courseStatusIndices = [0, 1]

export type Course = z.infer<typeof courseZodSchema>

export const newCourseZodSchema = courseZodSchema.pick({
	name: true
})

export type NewCourse = z.infer<typeof newCourseZodSchema>

export const updateCourseZodSchema = courseZodSchema
	.pick({
		name: true,
		status: true,
		archived: true,
		intervals: true,
		order: true
	})
	.partial()

export type UpdateCourse = z.infer<typeof updateCourseZodSchema>

export const courseSchema = courseZodSchema
	.pick({
		name: true,
		status: true,
		archived: true,
		intervals: true,
		createdAt: true,
		updatedAt: true,
		order: true
	})
	.extend({
		_id: z.custom<Types.ObjectId>((val) => val instanceof Types.ObjectId),
		owner: z.custom<Types.ObjectId>((val) => val instanceof Types.ObjectId)
	})

export type CourseSchema = z.infer<typeof courseSchema>
