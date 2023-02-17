import { Types } from 'mongoose'
import z from 'zod'

export const usernameZodSchema = z.string().min(1).max(12)

export const userZodSchema = z.object({
	_id: z.string(),
	username: usernameZodSchema
})
export type User = z.infer<typeof userZodSchema>

export const passwordZodSchema = z.custom<string>(
	(val) =>
		typeof val === 'string' &&
		/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,24}$/.test(val)
)
export const newUserZodSchema = userZodSchema.pick({ username: true }).extend({
	password: passwordZodSchema
})
export type NewUser = z.infer<typeof newUserZodSchema>

export const userSchema = userZodSchema.extend({
	_id: z.custom<Types.ObjectId>()
})

export type UserSchema = z.infer<typeof userSchema>
