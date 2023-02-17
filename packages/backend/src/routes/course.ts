import { assign } from 'lodash-es'
import { create, fetch, del, update } from '../models/Course.js'
import { printDebugInfo } from '../utils/debug.js'
import { toObjectId } from '../utils/id.js'
import { ctx } from '../ctx'
import { findError, courseEndpointDescription } from 'shared'
import * as progressHandlers from '../models/Progress'

export const router = ctx.router(courseEndpointDescription)

router.post('/courses', async (req, res) => {
	try {
		console.log({ user: req.user })
		res.status(200).json(await create(req.body, toObjectId(req.user._id)))
	} catch (err) {
		printDebugInfo(req)
		console.trace({ err })
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.put('/courses/:courseId', async (req, res) => {
	try {
		const updatedCourse = await update(
			toObjectId(req.params.courseId),
			req.body,
			toObjectId(req.user._id)
		)
		res.status(200).json(updatedCourse)
	} catch (err) {
		printDebugInfo(req)
		console.trace({ err })
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.delete('/courses/:courseId', async (req, res) => {
	try {
		await del(toObjectId(req.params.courseId), toObjectId(req.user._id))
		res.status(200).json({ deleted: true })
	} catch (err) {
		printDebugInfo(req)
		console.trace({ err })
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

/**
 * get a course
 */
router.get('/courses/:courseId', async (req, res) => {
	try {
		const course = await fetch({
			_id: toObjectId(req.params.courseId),
			owner: toObjectId(req.user._id)
		})
		res.status(200).json(course[0])
	} catch (err) {
		printDebugInfo(req)
		console.trace({ err })
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

/**
 * get all courses for a user
 */
router.get('/courses', async (req, res) => {
	try {
		const { isDue } = req.query
		const filter = assign(
			{},
			{
				owner: toObjectId(req.user._id)
			},
			{ isDue }
		)
		const courses = await fetch(filter)
		res.status(200).json(courses)
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.post('/courses/:courseId/progresses', async (req, res) => {
	try {
		const progress = await progressHandlers.create(
			toObjectId(req.params.courseId),
			req.body,
			toObjectId(req.user._id)
		)
		res.json(progress)
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.get('/courses/:courseId/progresses', async (req, res) => {
	try {
		res.status(200).json(
			await progressHandlers.fetch({
				owner: toObjectId(req.user._id),
				course: toObjectId(req.params.courseId)
			})
		)
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.get('/courses/:courseId/progresses/:progressId', async (req, res) => {
	try {
		const filter = {
			_id: toObjectId(req.params.progressId),
			course: toObjectId(req.params.courseId),
			owner: toObjectId(req.user._id)
		}
		const progress = (await progressHandlers.fetch(filter))[0]
		res.json(progress)
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.delete('/courses/:courseId/progresses/:progressId', async (req, res) => {
	try {
		await progressHandlers.del(
			toObjectId(req.params.progressId),
			toObjectId(req.user._id)
		)
		res.json({ deleted: true })
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.put('/courses/:courseId/progresses/:progressId', async (req, res) => {
	try {
		const updatedProgress = await progressHandlers.update(
			toObjectId(req.params.progressId),
			req.body,
			toObjectId(req.user._id)
		)
		return res.json(updatedProgress)
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})
