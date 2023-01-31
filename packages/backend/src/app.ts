import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
import expressSession from 'express-session'
import morgan from 'morgan'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

import User from './models/User.js'
import {router as authRouter} from './routes/auth.js'
import {router as courseRouter} from './routes/course.js'
import {router as progressRouter} from './routes/progress.js'

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DATABASE_PRODUCTION! : process.env.DATABASE_DEVELOPMENT!)

export const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressSession({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
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
app.use(['/auth/logout', '/course'], (req, res, next) => {
	console.log('Auth guard triggered.')
	if (!req.user) res.sendStatus(401)
	else 
		next()
})

app.use('/auth', authRouter)
app.use('/course', courseRouter)
app.use('/progress', progressRouter)

app.post('/', (_req, res) => {
	res.sendStatus(200)
})


