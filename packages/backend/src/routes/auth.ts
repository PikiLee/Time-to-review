import express from 'express'
import passport from 'passport'
import User from '../models/User.js'

export const router = express.Router()

router.get('/:username', async function(req, res) {
	try {
		const user = await User.findByUsername(req.params.username, false)
		if (!user) {
			res.sendStatus(200)
		} else {
			res.sendStatus(400)
		}
	} catch(err) {
		res.status(500).send(err)
	}
})

router.post('/register', function(req, res) {
	User.register(new User({ username : req.body.username }), req.body.password, function(err) {
		if (err) {
			return res.status(400).send({error: err})
		}

		passport.authenticate('local')(req, res, function () {
			loginHandler(req, res)
		})
	})
})

router.post('/login', passport.authenticate('local'), loginHandler)

router.post('/logout', function(req, res) {
	req.logout(function(err) {
		if (err) {  res.status(400).send('Please login first.') }
		res.sendStatus(200)
	})
})

function loginHandler(req: express.Request, res: express.Response) {
	if (req.user) {
		const user = req.user as any
		res.status(200).json({
			_id: user._id,
			username: user.username
		})
	} else {
		res.sendStatus(400)
	}
}