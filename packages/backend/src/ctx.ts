import { zodiosContext } from '@zodios/express'
import { z } from 'zod'

export const ctx = zodiosContext(
	z.object({
		user: z.object({
			_id: z.string(),
			username: z.string()
		})
	})
)
