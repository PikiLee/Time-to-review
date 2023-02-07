import express from 'express'
import {
	create,
	fetch,
	del,
	update,
	fetchDue,
	fetchAll
} from '../models/Course.js'
import { printDebugInfo } from '../utils/debug.js'
import { toObjectId } from '../utils/id.js'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		res.status(200).json(await create(req.body))
	} catch (err) {
		res.status(400).send(err)
	}
})

/**
 * get all courses for a user
 */
router.get('/', async (req, res) => {
	try {
		if (!req.user) throw new Error('login first')
		const course = await fetchAll((req.user as any)._id)
		res.status(200).json(course)
	} catch (err) {
		printDebugInfo(err)
		console.log(err)
		res.status(400).send(err)
	}
})

/**
 * get all due courses for a user
 */
router.get('/due', async (req, res) => {
	try {
		if (!req.user) throw new Error('User not found')
		const result = await fetchDue((req.user as any)._id)
		console.log(result)
		res.json(result)
	} catch (err) {
		printDebugInfo(req)
		console.debug({ err })
		res.status(400).send(err)
	}
})

/**
 * get a course
 */
router.get('/:courseId', async (req, res) => {
	try {
		const course = await fetch(toObjectId(req.params.courseId), {
			withProgresses: !!req.query.withProgresses,
			userId: toObjectId((req.user as any)._id)
		})
		res.status(200).json(course)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/:courseId', async (req, res) => {
	try {
		if (
			await del(toObjectId(req.params.courseId), {
				userId: toObjectId((req.user as any)._id)
			})
		) {
			res.sendStatus(200)
		} else {
			res.sendStatus(404)
		}
	} catch (err) {
		res.status(404).send(err)
	}
})

router.put('/:courseId', async (req, res) => {
	try {
		const updatedCourse = await update(
			toObjectId(req.params.courseId),
			req.body,
			{
				userId: toObjectId((req.user as any)._id),
				withProgresses: !!req.query.withProgresses
			}
		)
		if (updatedCourse) {
			res.status(200).json(updatedCourse)
		} else {
			res.sendStatus(404)
		}
	} catch (err) {
		printDebugInfo(req)
		console.trace({ err })
		res.status(400).send(err)
	}
})
