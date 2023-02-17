import { Types } from 'mongoose'
import { z } from 'zod'

export type ProgressStage = number

export const progressZodSchema = z.object({
	_id: z.string(),
	type: z.literal('progress'),
	course: z.string(),
	owner: z.string(),
	name: z.string(),
	stage: z.number().nonnegative(),
	lastDate: z.string().datetime(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	order: z.number().nonnegative(),
	nextDate: z.string().datetime(),
	isDue: z.boolean()
})

export type Progress = z.infer<typeof progressZodSchema>

export const newProgressZodSchema = progressZodSchema.pick({
	name: true,
	lastDate: true
})

export type NewProgress = z.infer<typeof newProgressZodSchema>

export const udpateProgressZodSchema = progressZodSchema
	.pick({
		name: true,
		stage: true,
		lastDate: true,
		order: true
	})
	.partial()

export type UpdateProgress = z.infer<typeof udpateProgressZodSchema>

const progressSchema = progressZodSchema
	.pick({
		name: true,
		stage: true,
		createdAt: true,
		updatedAt: true,
		order: true
	})
	.extend({
		_id: z.custom<Types.ObjectId>((val) => val instanceof Types.ObjectId),
		owner: z.custom<Types.ObjectId>((val) => val instanceof Types.ObjectId),
		course: z.custom<Types.ObjectId>(
			(val) => val instanceof Types.ObjectId
		),
		lastDate: z.custom<Date>((val) => val instanceof Date)
	})

export type ProgressSchema = z.infer<typeof progressSchema>
