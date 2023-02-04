import { del, fetch,  Progress,  update } from './../models/Progress.js'
import express from 'express'

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

