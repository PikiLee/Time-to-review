import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import expressSession from 'express-session'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { AUTH_URL, COURSE_URL, PROGRESS_URL } from 'shared'

import { User } from './models/User.js'
import { router as authRouter } from './routes/auth.js'
import { router as courseRouter } from './routes/course.js'
import { router as progressRouter } from './routes/progress.js'
import { createDb } from './models/db'

export const IS_DEV = process.env.NODE_ENV === 'development'

// throw error if enviorment variables do not exist
function checkEnvVarExistence(
	value: (string | undefined) | (string | undefined)[]
) {
	let error = false
	if (typeof value === undefined) error = true
	if (Array.isArray(value) && value.some((v) => v === undefined))
		error = false
	if (error) throw new Error('Enviornment variable not exist!')
}
if (IS_DEV) {
	checkEnvVarExistence([
		process.env.DATABASE_DEVELOPMENT,
		process.env.SESSION_SECRET_DEVELOPMRNT
	])
} else {
	checkEnvVarExistence([
		process.env.DATABASE_PRODUCTION,
		process.env.SESSION_SECRET_PRODUCTION
	])
}

export function createApp(
	options = {
		port: 3000
	}
) {
	createDb(
		IS_DEV
			? process.env.DATABASE_DEVELOPMENT!
			: process.env.DATABASE_PRODUCTION!
	)

	const app = express()

	// only allow cors in dev mode
	if (IS_DEV) {
		app.use(
			cors({
				origin: ['http://localhost:4173'],
				credentials: true,
				exposedHeaders: ['set-cookie']
			})
		)
	}
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	const ONE_DAY = 1000 * 60 * 60 * 24
	app.use(
		expressSession({
			secret: IS_DEV
				? process.env.SESSION_SECRET_DEVELOPMRNT!
				: process.env.SESSION_SECRET_PRODUCITON!,
			resave: false,
			saveUninitialized: false,
			cookie: { httpOnly: false, secure: !IS_DEV, maxAge: ONE_DAY }
		})
	)

	// passport
	app.use(passport.initialize())
	app.use(passport.session())
	passport.use(User.createStrategy())
	passport.serializeUser(User.serializeUser())
	passport.deserializeUser(User.deserializeUser())

	// log
	const logsDir = path.resolve(
		url.fileURLToPath(import.meta.url),
		'../../logs'
	)
	const accessLogPath = path.join(logsDir, 'access.log')
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir)
		console.log(`Created logs direcotry at ${logsDir}`)
	}
	const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' })
	app.use(morgan('combined', { stream: accessLogStream }))

	// auth guard
	app.use(['/course', '/progress'], (req, res, next) => {
		if (IS_DEV && !req.user)
			console.debug('Auth guard triggered. Not login.')
		if (!req.user) res.sendStatus(401)
		else next()
	})

	app.use((req, _res, next) => {
		if (req.body.data && Object.keys(req.body).length === 1) {
			req.body = req.body.data
		}
		next()
	})
	app.use(AUTH_URL, authRouter)
	app.use(COURSE_URL, courseRouter)
	app.use(PROGRESS_URL, progressRouter)

	app.post('/', (_req, res) => {
		res.sendStatus(200)
	})

	app.listen(options.port, () => {
		console.log(`Example app listening on port ${options.port}`)
	})

	return app
}
