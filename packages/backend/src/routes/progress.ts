import { del, fetch,  Progress,  update } from './../models/Progress.js'
import { fetch as fetchCourse} from '../models/Course.js'
import express from 'express'
import { printDebugInfo } from '../utils/debug.js'

export const router = express.Router()

router.post('/', printDebugInfo, async (req, res) => {
	try {
		const progress = new Progress(req.body)
		await progress.save()
		const course = await fetchCourse((progress as any).course)
		if (!course) throw new Error('Course not found')
		course.isDue = progress.isDue ?? course.progresses.some(progress => progress.isDue)
		await course.save()

		res.json(progress)
	} catch(err) {
		res.status(400).send(err)
	}
})

router.get('/:progressId', printDebugInfo, async (req, res) => {
	try {
		res.status(200).json(await fetch(req.params.progressId))
	} catch(err) {
		res.status(404).send(err)
	}
})

router.delete('/:progressId', printDebugInfo, async (req, res) => {
	try {
		if (await del(req.params.progressId)) {
			res.status(200).send()
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(404).send(err)
	}
})

router.put('/:progressId', printDebugInfo, async (req, res) => {
	try {
		const updatedProgress = await update(req.params.progressId, req.body)
		if (updatedProgress) {
			const course = await fetchCourse((updatedProgress as any).course)
			if (!course) throw new Error('Course not found')
			course.isDue = updatedProgress.isDue ?? course.progresses.some(progress => progress.isDue)
			await course.save()
			return res.json(updatedProgress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

