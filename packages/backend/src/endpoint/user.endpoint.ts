import { makeApi } from '@zodios/core'
import { z } from 'zod'

const userErrors = {
	default: {
		code: -1,
		message: 'Server Error.'
	},
	register: [
		{
			code: 0,
			message: 'Password invalid.'
		},
		{
			code: 1,
			message: 'Username exists.'
		}
	],
	username: [
		{
			code: 0,
			message: 'Username exists.'
		}
	]
}

export const endpointDescription = makeApi([
	{
		method: 'post',
		path: '/users',
		alias: 'register',
		description: 'Register a user',
		status: 201,
		response: z.object({
			id: z.string(),
			username: z.string()
		}),
		responseDescription: 'User Creaeted.',
		errors: [
			{
				status: 400,
				schema: z.object({
					code: z.number(),
					message: z.string()
				})
			},
			{
				status: 'default', // default status code will be used if error is not 404
				schema: z.object({
					code: z.number(),
					message: z.string()
				})
			}
		]
	},
	{
		method: 'get',
		path: '/users/username/:username',
		description: 'Check if a username already exists',
		status: 200,
		response: z.object({
			exist: z.boolean()
		}),
		responseDescription: 'User does not exist.',
		errors: [
			{
				status: 400,
				schema: z.object({
					code: z.number(),
					message: z.string()
				})
			},
			{
				status: 'default', // default status code will be used if error is not 404
				schema: z.object({
					code: z.number(),
					message: z.string()
				})
			}
		]
	}
])
