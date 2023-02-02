import { create, del, fetch, update } from './../models/Progress.js'
import express from 'express'
import { printDebugInfo } from '../utils/debug.js'

export const router = express.Router()

router.post('/', printDebugInfo, async (req, res) => {
	try {
		const doc = await create(req.body)
		console.log({doc})
		res.json(doc)	
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
			return res.json(updatedProgress)
		} else {
			res.sendStatus(404)
		}
	} catch(err) {
		res.status(400).send(err)
	}
})

