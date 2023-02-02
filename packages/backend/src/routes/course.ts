import express from 'express'
import { create, fetchAndPopulate, del, update } from '../models/Course.js'
import { printDebugInfo } from '../utils/debug.js'

export const router = express.Router()

router.post('/', printDebugInfo, async (req, res) => {
	try {
		res.status(200).json(await create(req.body))
	} catch(err) {
		res.status(400).send(err)
	}
})

router.get('/:courseId', printDebugInfo,  async (req, res) => {
	try {
		const course = await fetchAndPopulate(req.params.courseId)
		if (course) {
			res.status(200).json(course)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

router.delete('/:courseId', printDebugInfo,  async (req, res) => {
	try {
		if (await del(req.params.courseId)) {
			res.sendStatus(200)
		}	else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(404).send(err)
	}
})


router.put('/:courseId', printDebugInfo,  async (req, res) => {
	try {
		const updatedCourse = await update(req.params.courseId, req.body)
		if (updatedCourse) {
			res.status(200).json(updatedCourse)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})