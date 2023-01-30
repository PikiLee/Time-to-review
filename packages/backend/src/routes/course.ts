import express from 'express'
import { Course } from '../models/Course.js'
import User from '../models/User.js'

export const router = express.Router()

router.post('/:ownerId', async (req, res) => {
	try {
		const user = await User.findById(req.params.ownerId).exec()
		if (user) {
			const course = new Course({
				...req.body,
				owner: user._id
			})
			await course.save()
			await course.populate('owner')
			course.progresses
			res.status(200).json(course)
		} else {
			res.sendStatus(400)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

router.get('/:courseId', async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId).exec()
		if (course) {
			await course.populate('owner')
			if (course.progresses.length > 0)
				await course.populate('progresses')
			res.status(200).json(course)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

router.delete('/:courseId', async (req, res) => {
	try {
		const result = await Course.deleteOne({_id: req.params.courseId})
		if (result.deletedCount > 0) {
			res.status(200).send()
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(404).send(err)
	}
})


router.put('/:courseId', async (req, res) => {
	try {
		const result = await Course.updateOne({ _id: req.params.courseId }, req.body)
		if (result.acknowledged && result.modifiedCount > 0) {
			const updatedCourse = await Course.findById(req.params.courseId)
			if (updatedCourse) {
				await updatedCourse.populate('owner')
				if (updatedCourse.progresses.length > 0) {
					await updatedCourse.populate('progresses')
				}
				res.status(200).json(updatedCourse)
			} else {
				res.sendStatus(404)
			}
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})