import passport from 'passport'
import { ctx } from '../ctx'
import { User, fetch } from '../models/User.js'
import { printDebugInfo } from '../utils/debug'
import { findError, authEndpointDescription } from 'shared'

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
