import { Types } from 'mongoose'
import { zodiosContext } from '@zodios/express'
import { z } from 'zod'

export const ctx = zodiosContext(
	z.object({
		user: z.object({
			_id: z.custom<Types.ObjectId>(
				(val) => val instanceof Types.ObjectId
			),
			username: z.string()
		})
	})
)
