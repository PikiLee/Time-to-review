import {
	courseZodSchema,
	progressZodSchema,
	updateCourseZodSchema,
	newProgressZodSchema,
	udpateProgressZodSchema,
	newCourseZodSchema
} from '../types'
import { makeApi } from '@zodios/core'
import { z } from 'zod'
import { errorZodSchemas } from './errors'

export const getCourseEndpoints = {
	createCourse() {
		return {
			method: 'post',
			path: '/courses'
		} as const
	},
	getCourse() {
		return {
			method: 'get',
			path: '/courses/:courseId'
		} as const
	},
	getAllCourses() {
		return {
			method: 'get',
			path: '/courses'
		} as const
	},
	getAllProgress() {
		return {
			method: 'get',
			path: '/courses/:courseId/progresses'
		} as const
	},
	deleteCourse() {
		return {
			method: 'delete',
			path: `/courses/:courseId`
		} as const
	},
	updateCourse() {
		return {
			method: 'put',
			path: `/courses/:courseId`
		} as const
	},
	createProgress() {
		return {
			method: 'post',
			path: '/courses/:courseId/progresses'
		} as const
	},
	updateProgress() {
		return {
			method: 'put',
			path: '/courses/:courseId/progresses/:progressId'
		} as const
	},
	deleteProgress() {
		return {
			method: 'delete',
			path: '/courses/:courseId/progresses/:progressId'
		} as const
	},
	getProgress() {
		return {
			method: 'get',
			path: '/courses/:courseId/progresses/:progressId'
		} as const
	}
}

export const courseEndpointDescription = makeApi([
	{
		method: 'post',
		path: '/courses',
		alias: 'createCourse',
		description: 'Create a Course',
		parameters: [
			{ name: 'body', type: 'Body', schema: newCourseZodSchema },
			{ name: 'body', type: 'Body', schema: newCourseZodSchema }
		],
		status: 200,
		response: courseZodSchema,
		responseDescription: 'Course Created.',
		errors: [errorZodSchemas[400], errorZodSchemas.default]
	},
	{
		method: 'get',
		path: '/courses',
		alias: 'getAllCourses',
		description: 'Get all courses',
		parameters: [
			{ name: 'isDue', type: 'Query', schema: z.boolean().optional() },
			{ name: 'search', type: 'Query', schema: z.string().optional() }
		],
		status: 200,
		response: z.array(courseZodSchema),
		errors: [errorZodSchemas.default]
	},
	{
		method: 'get',
		path: '/courses/:courseId',
		alias: 'getCourse',
		description: 'Get a courses',
		parameters: [{ name: 'courseId', type: 'Path', schema: z.string() }],
		status: 200,
		response: courseZodSchema,
		errors: [errorZodSchemas[404], errorZodSchemas.default]
	},
	{
		method: 'put',
		path: '/courses/:courseId',
		alias: 'updateCourse',
		description: 'Update a courses',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'body', type: 'Body', schema: updateCourseZodSchema }
		],
		status: 200,
		response: courseZodSchema,
		errors: [
			errorZodSchemas[400],
			errorZodSchemas[404],
			errorZodSchemas.default
		]
	},
	{
		method: 'delete',
		path: '/courses/:courseId',
		alias: 'deleteCourse',
		description: 'Delete a courses',
		parameters: [{ name: 'courseId', type: 'Path', schema: z.string() }],
		status: 200,
		response: z.object({
			deleted: z.boolean()
		}),
		errors: [errorZodSchemas[404], errorZodSchemas.default]
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
		errors: [errorZodSchemas[404], errorZodSchemas.default]
	},
	{
		method: 'get',
		path: '/courses/:courseId/progresses',
		alias: 'getAllProgress',
		description: 'Get all progresses',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'isDue', type: 'Query', schema: z.boolean().optional() },
			{ name: 'search', type: 'Query', schema: z.string().optional() },
			{ name: 'searchAll', type: 'Query', schema: z.boolean().optional() }
		],
		status: 200,
		response: z.array(progressZodSchema),
		errors: [errorZodSchemas.default]
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
		errors: [errorZodSchemas[404], errorZodSchemas.default]
	},
	{
		method: 'put',
		path: '/courses/:courseId/progresses/:progressId',
		alias: 'updateProgress',
		description: 'Update a progress',
		parameters: [
			{ name: 'courseId', type: 'Path', schema: z.string() },
			{ name: 'progressId', type: 'Path', schema: z.string() },
			{ name: 'body', type: 'Body', schema: udpateProgressZodSchema }
		],
		status: 200,
		response: progressZodSchema,
		errors: [
			errorZodSchemas[400],
			errorZodSchemas[404],
			errorZodSchemas.default
		]
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
		errors: [errorZodSchemas[404], errorZodSchemas.default]
	}
])
