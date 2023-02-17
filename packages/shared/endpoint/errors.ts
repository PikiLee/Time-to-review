import { z } from 'zod'

export const errorZodSchemas = {
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

export const errors = [
	{
		_id: -1,
		code: 500,
		message: 'Server Error.'
	},
	{
		_id: 0,
		code: 404,
		message: 'Course Not Found'
	},
	{
		_id: 1,
		code: 404,
		message: 'Progress Not Found'
	},
	{
		_id: 2,
		code: 400,
		message: 'Invalid'
	},
	{
		_id: 3,
		code: 401,
		message: 'unauthorized'
	},
	{
		_id: 4,
		code: 404,
		message: 'User Not Found'
	},
	{
		_id: 5,
		code: 400,
		message: 'Password invalid.'
	},
	{
		_id: 6,
		code: 400,
		message: 'Username exists.'
	},
	{
		_id: 7,
		code: 400,
		message: 'Custom'
	}
]

export function findError(_id: number) {
	return errors.find((e) => e._id === _id) ?? errors[0]
}
