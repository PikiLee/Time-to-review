import { create, del, fetch, update } from './../models/Progress.js'
import express from 'express'
import { toObjectId } from '../utils/id.js'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		const progress = await create(req.body)
		res.json(progress)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.get('/:progressId', async (req, res) => {
	try {
		res.status(200).json(
			await fetch(toObjectId(req.params.progressId), {
				userId: (req.user as any)._id
			})
		)
	} catch (err) {
		res.status(404).send(err)
	}
})

router.delete('/:progressId', async (req, res) => {
	try {
		if (
			await del(toObjectId(req.params.progressId), {
				userId: (req.user as any)._id
			})
		) {
			res.status(200).send()
		} else {
			res.sendStatus(404)
		}
	} catch (err) {
		res.status(404).send(err)
	}
})

router.put('/:progressId', async (req, res) => {
	try {
		const updatedProgress = await update(
			toObjectId(req.params.progressId),
			req.body,
			{ userId: (req.user as any)._id }
		)
		if (updatedProgress) {
			return res.json(updatedProgress)
		} else {
			res.sendStatus(404)
		}
	} catch (err) {
		res.status(400).send(err)
	}
})
