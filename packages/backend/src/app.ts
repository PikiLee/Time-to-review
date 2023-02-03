import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
import expressSession from 'express-session'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { AUTH_URL, COURSE_URL, PROGRESS_URL } from 'shared'

import User from './models/User.js'
import {router as authRouter} from './routes/auth.js'
import {router as courseRouter} from './routes/course.js'
import {router as progressRouter} from './routes/progress.js'

export const IS_DEV = process.env.NODE_ENV === 'development'
mongoose.connect(IS_DEV ?  process.env.DATABASE_DEVELOPMENT! : process.env.DATABASE_PRODUCTION!)

export const app = express()

app.use(cors({
	origin: [
		'http://localhost:4173',
	],
	credentials: true,
	exposedHeaders: ['set-cookie'],
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressSession({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	cookie: {httpOnly: false, secure: !IS_DEV}
}))

// passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// log
const logsDir = path.resolve(url.fileURLToPath(import.meta.url), '../../logs')
const accessLogPath = path.join(logsDir, 'access.log') 
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir)
	console.log(`Created logs direcotry at ${logsDir}`)
}
const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' })
app.use(morgan('combined', {stream: accessLogStream}))

// auth guard
app.use(['/course', '/progress'], (req, res, next) => {
	if (IS_DEV) console.debug('Auth guard triggered.')
	if (!req.user) res.sendStatus(401)
	else 
		next()
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


