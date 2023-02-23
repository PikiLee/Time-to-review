import { userZodSchema, usernameZodSchema, newUserZodSchema } from '../types'
import { makeApi } from '@zodios/core'
import { z } from 'zod'
import { errorZodSchemas } from './errors'

export const getAuthEndpoints = {
	register() {
		return {
			method: 'post',
			path: '/auth'
		} as const
	},
	checkUsername() {
		return {
			method: 'get',
			path: '/auth/:username'
		} as const
	},
	login() {
		return {
			method: 'put',
			path: '/auth'
		} as const
	},
	logout() {
		return {
			method: 'delete',
			path: '/auth'
		} as const
	}
}

export const authEndpointDescription = makeApi([
	{
		method: 'post',
		path: '/auth',
		alias: 'register',
		description: 'Register a user',
		parameters: [
			{ name: 'body', type: 'Body', schema: newUserZodSchema },
			{ name: 'token', type: 'Query', schema: z.string() }
		],
		status: 200,
		response: userZodSchema,
		errors: [errorZodSchemas[400], errorZodSchemas.default]
	},
	{
		method: 'get',
		path: '/auth/:username',
		alias: 'checkUsername',
		description: 'Check if a username already exists',
		parameters: [
			{ name: 'username', type: 'Path', schema: usernameZodSchema }
		],
		status: 200,
		response: z.object({
			exist: z.boolean()
		}),
		responseDescription: 'User does not exist.',
		errors: [errorZodSchemas.default]
	},
	{
		method: 'put',
		path: '/auth',
		alias: 'login',
		description: 'login',
		parameters: [
			{ name: 'body', type: 'Body', schema: newUserZodSchema },
			{ name: 'token', type: 'Query', schema: z.string() }
		],
		status: 200,
		response: userZodSchema,
		errors: [
			errorZodSchemas[400],
			errorZodSchemas[404],
			errorZodSchemas.default
		]
	},
	{
		method: 'delete',
		path: '/auth',
		alias: 'logout',
		description: 'logout',
		status: 200,
		response: z.object({
			loggedout: z.boolean()
		}),
		errors: [errorZodSchemas[401], errorZodSchemas.default]
	}
])
