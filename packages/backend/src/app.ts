import * as dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser'
import passport from 'passport'
import expressSession from 'express-session'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

import { User } from './models/User.js'
import { router as authRouter } from './routes/auth.js'
import { router as courseRouter } from './routes/course.js'
import { createDb } from './models/db.js'
// @ts-expect-error better-sqlite3-session-store has no types
import sessionStore from 'better-sqlite3-session-store'
import sqlite from 'better-sqlite3'
import { ctx } from './ctx'
import { findError } from 'shared'
import { printDebugInfo } from './utils/debug'

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
		process.env.SESSION_SECRET_DEVELOPMRNT,
		process.env.CORS_ORIGIN_DEVELOPMENT
	])
} else {
	checkEnvVarExistence([
		process.env.DATABASE_PRODUCTION,
		process.env.SESSION_SECRET_PRODUCTION,
		process.env.CORS_ORIGIN_PRODUCTION
	])
}

export async function createApp(
	options = {
		port: 13000
	}
) {
	await createDb(IS_DEV ? undefined : process.env.DATABASE_PRODUCTION!)

	const app = ctx.app()

	app.use(
		cors({
			origin: IS_DEV
				? process.env.CORS_ORIGIN_DEVELOPMENT!
				: process.env.CORS_ORIGIN_PRODUCTION!,
			credentials: true,
			exposedHeaders: ['set-cookie']
		})
	)
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	// session
	const ONE_DAY = 1000 * 60 * 60 * 24
	const SqliteStore = sessionStore(expressSession)
	const sessionDb = new sqlite('sessions.db', { verbose: console.log })
	app.use(
		expressSession({
			store: new SqliteStore({
				client: sessionDb,
				expired: {
					clear: true,
					intervalMs: 900000 //ms = 15min
				}
			}),
			secret: IS_DEV
				? process.env.SESSION_SECRET_DEVELOPMRNT!
				: process.env.SESSION_SECRET_PRODUCITON!,
			resave: false,
			saveUninitialized: false,
			cookie: { httpOnly: false, secure: false, maxAge: 30 * ONE_DAY }
		})
	)

	// passport
	app.use(passport.initialize())
	app.use(passport.session())
	passport.use(User.createStrategy())
	// todo
	// @ts-expect-error need correct type
	passport.serializeUser(User.serializeUser())
	passport.deserializeUser(User.deserializeUser())

	// log
	if (IS_DEV) {
		const logsDir = path.resolve(
			url.fileURLToPath(import.meta.url),
			'../../logs'
		)
		const accessLogPath = path.join(logsDir, 'access.log')
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir)
			console.log(`Created logs direcotry at ${logsDir}`)
		}
		const accessLogStream = fs.createWriteStream(accessLogPath, {
			flags: 'a'
		})
		app.use(morgan('combined', { stream: accessLogStream }))
	} else {
		app.use(morgan('combined'))
	}

	// auth guard
	app.use('/courses', (req, res, next) => {
		if (IS_DEV && !req.user)
			console.debug('Auth guard triggered. Not login.')

		if (!req.user) {
			printDebugInfo(req)
			const error = findError(3)
			res.status(error.code).send(error)
		} else {
			next()
		}
	})

	app.use((req, _res, next) => {
		if (req.body.data && Object.keys(req.body).length === 1) {
			req.body = req.body.data
		}
		next()
	})
	app.use(authRouter)
	app.use(courseRouter)

	app.post('/', (_req, res) => {
		res.sendStatus(200)
	})

	app.listen(options.port, () => {
		console.log(`Example app listening on port ${options.port}`)
	})

	return app
}
