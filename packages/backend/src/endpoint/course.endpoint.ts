import {
	courseZodSchema,
	progressZodSchema,
	updateCourseZodSchema,
	newProgressZodSchema,
	udpateProgressZodSchema,
	newCourseZodSchema
} from 'shared'
import { makeApi } from '@zodios/core'
import { z } from 'zod'

const errors = {
	default: {
		status: 'default',
		schema: z.object({
			_id: z.number(),
			code: z.number(),
			message: z.string()
		})
	},
	400: {
		status: 400,
		schema: z.object({
			_id: z.number(),
			code: z.number(),
			message: z.string()
		})
	},
	401: {
		status: 401,
		schema: z.object({
			_id: z.number(),
			code: z.number(),
			message: z.string()
		})
	},
	404: {
		status: 404,
		schema: z.object({
			_id: z.number(),
			code: z.number(),
			message: z.string()
		})
	}
} as const

export const courseEndpointDescription = makeApi([
	{
		method: 'post',
		path: '/courses',
		alias: 'create',
		description: 'Create a Course',
		parameters: [
			{ name: 'body', type: 'Body', schema: newCourseZodSchema }
		],
		status: 200,
		response: courseZodSchema,
		responseDescription: 'Course Created.',
		errors: [errors[400], errors.default]
	},
	{
		method: 'get',
		path: '/courses',
		alias: 'getAll',
		description: 'Get all courses',
		parameters: [
			{ name: 'isDue', type: 'Query', schema: z.boolean().optional() }
		],
		status: 200,
		response: z.array(courseZodSchema),
		errors: [errors.default]
	},
	{
		method: 'get',
		path: '/courses/:courseId',
		alias: 'get',
		description: 'Get a courses',
		parameters: [{ name: 'courseId', type: 'Path', schema: z.string() }],
		status: 200,
		response: courseZodSchema,
		errors: [errors[404], errors.default]
	},
	{
		method: 'put',
		path: '/courses/:courseId',
		alias: 'udpate',
		description: 'Update a courses',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'body', type: 'Body', schema: updateCourseZodSchema }
		],
		status: 200,
		response: courseZodSchema,
		errors: [errors[400], errors[404], errors.default]
	},
	{
		method: 'delete',
		path: '/courses/:courseId',
		alias: 'delete',
		description: 'Delete a courses',
		parameters: [{ name: 'courseId', type: 'Path', schema: z.string() }],
		status: 200,
		response: z.object({
			deleted: z.boolean()
		}),
		errors: [errors[404], errors.default]
	},
	{
		method: 'post',
		path: '/courses/:courseId/progresses',
		alias: 'createProgress',
		description: 'Create a progress',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'body', type: 'Body', schema: newProgressZodSchema }
		],
		status: 200,
		response: progressZodSchema,
		errors: [errors[404], errors.default]
	},
	{
		method: 'get',
		path: '/courses/:courseId/progresses',
		alias: 'getAllProgress',
		description: 'Get all progresses',
		parameters: [{ name: 'courseId', type: 'Path', schema: z.string() }],
		status: 200,
		response: z.array(progressZodSchema),
		errors: [errors.default]
	},
	{
		method: 'get',
		path: '/courses/:courseId/progresses/:progressId',
		alias: 'getProgress',
		description: 'Get a progress',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'progressId', type: 'Path', schema: z.string() }
		],
		status: 200,
		response: progressZodSchema,
		errors: [errors[404], errors.default]
	},
	{
		method: 'put',
		path: '/courses/:courseId/progresses/:progressId',
		alias: 'udpateProgress',
		description: 'Update a progress',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'progressId', type: 'Path', schema: z.string() },
			{ name: 'body', type: 'Body', schema: udpateProgressZodSchema }
		],
		status: 200,
		response: progressZodSchema,
		errors: [errors[400], errors[404], errors.default]
	},
	{
		method: 'delete',
		path: '/courses/:courseId/progresses/:progressId',
		alias: 'deleteProgress',
		description: 'Delete a progress',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'progressId', type: 'Path', schema: z.string() }
		],
		status: 200,
		response: z.object({
			deleted: z.boolean()
		}),
		errors: [errors[404], errors.default]
	}
])
