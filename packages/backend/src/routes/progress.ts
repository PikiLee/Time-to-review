import { del, fetch,  fetchProgressesByCourseId,  Progress,  update } from './../models/Progress.js'
import express from 'express'
import { printDebugInfo } from '../utils/debug.js'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		const progress = new Progress(req.body)
		await progress.save()
		res.json(progress)
	} catch(err) {
		res.status(400).send(err)
	}
})

router.get('/course/:courseId', async (req, res) => {
	try {
		const progresses = await fetchProgressesByCourseId(req.params.courseId, (req.user as any)._id)
		res.status(200).json(progresses)
	} catch(err) {
		printDebugInfo(req)
		console.log({err})
		res.status(404).send(err)
	}
})

router.get('/:progressId', async (req, res) => {
	try {
		res.status(200).json(await fetch(req.params.progressId))
	} catch(err) {
		res.status(404).send(err)
	}
})

router.delete('/:progressId', async (req, res) => {
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

router.put('/:progressId', async (req, res) => {
	try {
		const updatedProgress = await update(req.params.progressId, req.body)
		if (updatedProgress) {
			return res.json(updatedProgress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

