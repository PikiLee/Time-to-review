import express from 'express'
import { create, fetch, del, update, fetchDue } from '../models/Course.js'
import { printDebugInfo } from '../utils/debug.js'

export const router = express.Router()

router.post('/', async (req, res) => {
	try {
		res.status(200).json(await create(req.body))
	} catch (err) {
		res.status(400).send(err)
	}
})

router.get('/due', async (req, res) => {
	try {
		if (!req.user) throw new Error('User not found')
		const result = await fetchDue((req.user as any)._id)
		console.log(result)
		res.json(result)
	} catch (err) {
		printDebugInfo(req)
		console.debug({err})
		res.status(400).send(err)
	}
})

// router.get('/', printDebugInfo, async (req, res) => {
// 	try {
// 		const course = await Course.aggregate([
// 			{ $match: { owner: (req.user as any)._id } },
// 			{
// 				$lookup: {
// 					from: 'progresses',
// 					localField: '_id',
// 					foreignField: 'course',
// 					as: 'progresses',
// 				},
// 			},
// 			{
// 				$project: {
// 					name: 1,
// 					owner: 1,
// 					status: 1,
// 					archived: 1,
// 					order: 1,
// 					createdAt: 1,
// 					updatedAt: 1,
// 					isDue: {
// 						$gt: [
// 							{
// 								$size: {
// 									$filter: {
// 										input: '$progresses',
// 										as: 'item',
// 										cond: { $eq: ['$$item.isDue', true] },
// 									},
// 								},
// 							},
// 							0,
// 						],
// 					},
// 					progressCount: { $size: '$progresses' },
// 				},
// 			},
// 		])
// 		// const isDue = Course.aggregate([
// 		// 	{$match: {owner: (req.user as any)._id}},
// 		// 	{
// 		// 		$lookup: {
// 		// 			from: 'progresses',
// 		// 			localField: '_id',
// 		// 			foreignField: 'course',
// 		// 			as: 'progresses'
// 		// 		}
// 		// 	},
// 		// 	{$match: {isDue: true}},
// 		// 	{$group: {_id: '$_id', dueCount: {$count: {}}}},
// 		// 	{$project: {isDue: {$gt: ['$dueCount', 0]}}}
// 		// ])

// 		if (course) {
// 			res.status(200).json(course)
// 		} else {
// 			res.sendStatus(404)
// 		}
// 	} catch (err) {
// 		console.log(err)
// 		res.status(400).send(err)
// 	}
// })

router.get('/:courseId', async (req, res) => {
	try {
		const course = await fetch(req.params.courseId, {withProgresses: !!req.query.withProgresses})
		if (!course.owner.equals((req.user as any)._id)) throw new Error('Not authorized.')
		res.status(200).json(course)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/:courseId', async (req, res) => {
	try {
		if (await del(req.params.courseId)) {
			res.sendStatus(200)
		} else {
			res.sendStatus(404)
		}
	} catch (err) {
		res.status(404).send(err)
	}
})

router.put('/:courseId',  async (req, res) => {
	try {
		const updatedCourse = await update(req.params.courseId, req.body)
		if (updatedCourse) {
			res.status(200).json(updatedCourse)
		} else {
			res.sendStatus(404)
		}
	} catch (err) {
		res.status(400).send(err)
	}
})
