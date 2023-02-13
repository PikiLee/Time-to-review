import { create, del, fetch, update } from './../models/Progress.js'
import express from 'express'
import { toObjectId } from '../utils/id.js'
import { printDebugInfo } from '../utils/debug.js'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		const progress = await create(req.body, {
			currentUserId: toObjectId((req.user as any)._id)
		})
		res.json(progress)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.get('/all/:courseId', async (req, res) => {
	try {
		res.status(200).json(
			await fetch({
				owner: toObjectId((req.user as any)._id),
				course: toObjectId(req.params.courseId)
			})
		)
	} catch (err) {
		printDebugInfo(req)
		console.log({ err })
		res.status(404).send(err)
	}
})

router.get('/:progressId', async (req, res) => {
	try {
		res.status(200).json(
			await fetch({
				_id: toObjectId(req.params.progressId),
				owner: toObjectId((req.user as any)._id)
			})
		)
	} catch (err) {
		res.status(404).send(err)
	}
})

router.delete('/:progressId', async (req, res) => {
	try {
		await del(toObjectId(req.params.progressId), {
			currentUserId: toObjectId((req.user as any)._id)
		})
		res.sendStatus(200)
	} catch (err) {
		res.status(404).send(err)
	}
})

router.put('/:progressId', async (req, res) => {
	try {
		const updatedProgress = await update(
			toObjectId(req.params.progressId),
			req.body,
			{ currentUserId: toObjectId((req.user as any)._id) }
		)
		return res.json(updatedProgress)
	} catch (err) {
		res.status(400).send(err)
	}
})
