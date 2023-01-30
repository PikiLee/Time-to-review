import { Course } from './../models/Course.js'
import { Progress } from './../models/Progress.js'
import express from 'express'

export const router = express.Router()

router.post('/:courseId', async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId).exec()
		if (course) {
			const progress = new Progress(req.body)
			await progress.save()
			course.progresses.push(progress)
			await course.save()
			res.status(200).json(progress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

router.get('/:progressId', async (req, res) => {
	try {
		const progress = await Progress.findById(req.params.progressId).exec()
		if (progress) {
			res.status(200).json(progress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

router.delete('/:progressId', async (req, res) => {
	try {
		const result = await Progress.deleteOne({_id: req.params.progressId})
		if (result.deletedCount > 0) {
			res.status(200).send()
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(404).send(err)
	}
})

router.put('/:progressId', async (req, res) => {
	try {
		const result = await Progress.updateOne({ _id: req.params.progressId }, req.body)
		if (result.acknowledged && result.modifiedCount > 0) {
			const updatedProgress = await Progress.findById(req.params.progressId)
			res.status(200).json(updatedProgress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

