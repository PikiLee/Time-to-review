import express from 'express'
import { create, fetch, del, update } from '../models/Course.js'
import { printDebugInfo } from '../utils/debug.js'
import { toObjectId } from '../utils/id.js'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		res.status(200).json(
			await create(req.body, {
				currentUserId: toObjectId((req.user as any)._id)
			})
		)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.put('/:courseId', async (req, res) => {
	try {
		const updatedCourse = await update(
			toObjectId(req.params.courseId),
			req.body,
			{
				currentUserId: toObjectId((req.user as any)._id),
				...req.query
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

router.delete('/:courseId', async (req, res) => {
	try {
		await del(toObjectId(req.params.courseId), {
			currentUserId: toObjectId((req.user as any)._id)
		})

		res.sendStatus(200)
	} catch (err) {
		res.status(404).send(err)
	}
})

/**
 * get due courses
 */
router.get('/due', async (req, res) => {
	try {
		const courses = await fetch(
			{
				owner: toObjectId((req.user as any)._id)
			},
			req.query
		)
		res.status(200).json(courses.filter((course) => course.isDue === true))
	} catch (err) {
		res.status(400).send(err)
	}
})

/**
 * get a course
 */
router.get('/:courseId', async (req, res) => {
	try {
		const course = await fetch(
			{
				_id: toObjectId(req.params.courseId),
				owner: toObjectId((req.user as any)._id)
			},
			req.query
		)
		if (course.length === 0) throw new Error('now found.')
		res.status(200).json(course[0])
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
		const course = await fetch(
			{
				owner: toObjectId((req.user as any)._id)
			},
			req.query
		)
		res.status(200).json(course)
	} catch (err) {
		printDebugInfo(err)
		console.log(err)
		res.status(400).send(err)
	}
})
