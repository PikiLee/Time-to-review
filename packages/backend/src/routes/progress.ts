import { create, del, fetch, update } from './../models/Progress.js'
import express from 'express'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		res.send(await create(req.body))	
	} catch(err) {
		res.status(400).send(err)
	}
})

router.get('/:progressId', async (req, res) => {
	try {
		res.status(200).send(await fetch(req.params.progressId))
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
			return res.send(updatedProgress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

