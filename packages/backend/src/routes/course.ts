import { escapeRegExp } from 'lodash-es'
import { create, fetch, del, update } from '../models/Course.js'
import { printDebugInfo } from '../utils/debug.js'
import { errorIfCourseNotExist, toObjectId } from '../utils/id.js'
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
		if (course.length === 0) throw Error('0')
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
		let filter
		if (req.query.search) {
			filter = {
				owner: toObjectId(req.user._id),
				name: {
					$regex: new RegExp(escapeRegExp(req.query.search), 'i')
				}
			}
		} else {
			filter = {
				owner: toObjectId(req.user._id)
			}
		}
		let courses = await fetch(filter)
		if (req.query.isDue) courses = courses.filter((c) => c.isDue)
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
		let filter
		if (req.query.search) {
			if (req.query.searchAll) {
				filter = {
					owner: toObjectId(req.user._id),
					name: {
						$regex: escapeRegExp(req.query.search)
					}
				}
			} else {
				filter = {
					owner: toObjectId(req.user._id),
					course: toObjectId(req.params.courseId),
					name: {
						$regex: escapeRegExp(req.query.search)
					}
				}
			}
		} else {
			filter = {
				owner: toObjectId(req.user._id),
				course: toObjectId(req.params.courseId)
			}
		}
		let progresses = await progressHandlers.fetch(filter)
		if (req.query.isDue) progresses = progresses.filter((p) => p.isDue)
		res.status(200).json(progresses)
	} catch (err) {
		printDebugInfo(req)
		console.log(err)
		const error = findError(Number((err as Error).message))
		res.status(error.code).send(error)
	}
})

router.get('/courses/:courseId/progresses/:progressId', async (req, res) => {
	try {
		errorIfCourseNotExist(req.params.courseId)
		const filter = {
			_id: toObjectId(req.params.progressId),
			course: toObjectId(req.params.courseId),
			owner: toObjectId(req.user._id)
		}
		const progress = await progressHandlers.fetch(filter)
		if (progress.length === 0) throw Error('1')
		res.json(progress[0])
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
