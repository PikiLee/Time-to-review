import { IS_DEV } from './../app'
import * as dotenv from 'dotenv'
dotenv.config()

import passport from 'passport'
import { ctx } from '../ctx'
import { User, fetch } from '../models/User.js'
import { printDebugInfo } from '../utils/debug'
import { findError, authEndpointDescription } from 'shared'
import axios from 'axios'

export const router = ctx.router(authEndpointDescription)

router.get('/auth/:username', async function (req, res) {
	try {
		const user = await User.findByUsername(req.params.username, false)
		res.json({ exist: !!user })
	} catch (err) {
		printDebugInfo(req)
		console.trace({ err })
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.post(
	'/auth',
	async function (req, res, next) {
		if (!IS_DEV) {
			try {
				await verifyTurnstileToken(req.query.token)
			} catch (err) {
				printDebugInfo(req)
				console.trace({ err })
				const error = findError(Number((err as Error).message))
				res.status(error.code).send(error)
			}
		}
		next()
	},
	function (req, res, next) {
		User.register(
			new User({ username: req.body.username }),
			req.body.password,
			function (err) {
				if (err) {
					printDebugInfo(req)
					console.trace({ err })
					const error = findError(7)
					return res
						.status(error.code)
						.json({ ...error, message: err })
				}

				passport.authenticate('local')(req, res, next)
			}
		)
	},
	async function loginHandler(req, res) {
		try {
			const user = (await fetch(req.user._id))[0]
			res.status(200).json(user)
		} catch (err) {
			printDebugInfo(req)
			console.trace({ err })
			const error = findError(3)
			return res.status(error.code).json(error)
		}
	}
)

router.put(
	'/auth',
	async function (req, res, next) {
		try {
			await verifyTurnstileToken(req.query.token)
			next()
		} catch (err) {
			printDebugInfo(req)
			console.trace({ err })
			const error = findError(Number((err as Error).message))
			res.status(error.code).send(error)
		}
	},
	passport.authenticate('local'),
	async function loginHandler(req, res) {
		try {
			const user = (await fetch(req.user._id))[0]
			res.status(200).json(user)
		} catch (err) {
			printDebugInfo(req)
			console.trace({ err })
			const error = findError(3)
			return res.status(error.code).json(error)
		}
	}
)

router.delete('/auth', function (req, res) {
	req.logout(function (err) {
		if (err) {
			printDebugInfo(req)
			console.trace({ err })
			const error = findError(3)
			return res.status(error.code).json(error)
		}
		res.json({ loggedout: true })
	})
})

async function verifyTurnstileToken(token: string) {
	const res = await axios.post(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			response: token,
			secret: process.env.TURNSTILE_SECRET_KEY
		}
	)
	if (!res.data.success) throw Error('2')
}
