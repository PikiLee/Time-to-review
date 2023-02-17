import { NewProgress, UpdateProgress } from 'shared'
import mongoose, { Types } from 'mongoose'
import { ProgressSchema as ProgressSchemaType } from 'shared'
import lodash, { assign } from 'lodash-es'
import {
	errorIfCourseNotExist,
	errorIfIdNotEqual,
	errorIfProgressNotExist
} from '../utils/id.js'

const { Schema } = mongoose

const progressSchema = new Schema<ProgressSchemaType>(
	{
		name: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 60,
			index: true
		},
		owner: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
		},
		course: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Course',
			required: true
		},
		stage: {
			type: Number,
			default: 0
		},
		lastDate: {
			type: Date,
			required: true
		},
		order: {
			type: Number,
			required: true
		}
	},
	{
		id: false,
		timestamps: true
	}
)

progressSchema.set('toJSON', { versionKey: false, virtuals: true })

export const Progress = mongoose.model<ProgressSchemaType>(
	'Progress',
	progressSchema
)
;(async function () {
	await Progress.createCollection()
})()

export function createNextDateField(
	progress: string | object,
	course: string | object
) {
	return {
		$add: [
			`${progress}.lastDate`,
			{
				$multiply: [
					{
						$arrayElemAt: [
							{
								$getField: {
									field: 'intervals',
									input: course
								}
							},
							`${progress}.stage`
						]
					},
					1000,
					60,
					60,
					24
				]
			}
		]
	}
}

export function createdProgressIsDueField(
	progress: string | object,
	course: string | object
) {
	return {
		$gte: [
			{
				$dateDiff: {
					startDate: createNextDateField(progress, course),
					endDate: '$$NOW',
					unit: 'second'
				}
			},
			0
		]
	}
}

export function createProgressProjectStage(
	progress: string | object,
	course: string | object
) {
	return {
		$project: {
			type: 'progress',
			course: 1,
			owner: 1,
			name: 1,
			stage: 1,
			lastDate: 1,
			createdAt: 1,
			updatedAt: 1,
			order: 1,
			nextDate: createNextDateField(progress, course),
			isDue: createdProgressIsDueField(progress, course)
		}
	}
}

export function createSortStage() {
	return {
		$sort: { order: 1, name: 1 }
	} as const
}

export async function fetch(filter: any) {
	const doc = await Progress.aggregate([
		{ $match: filter },
		{
			$lookup: {
				from: 'courses',
				localField: 'course',
				foreignField: '_id',
				as: 'c'
			}
		},
		createProgressProjectStage('$$CURRENT', { $arrayElemAt: ['$c', 0] }),
		createSortStage()
	])

	return doc
}

export async function create(
	courseId: Types.ObjectId,
	rawProgress: NewProgress,
	currentUserId: Types.ObjectId
) {
	const course = await errorIfCourseNotExist(courseId)
	// check if the owner of the course is the same as the one in newProgress
	errorIfIdNotEqual(course.owner, currentUserId)

	const count = await Progress.find({ owner: currentUserId }).count()
	const newProgress = assign(
		{},
		{
			course: courseId,
			owner: currentUserId,
			stage: 0,
			order: count
		},
		rawProgress
	)

	const progress = new Progress(newProgress)
	await progress.save()
	return (await fetch({ _id: progress._id }))[0]
}

export async function del(
	progressId: Types.ObjectId,
	currentUserId: Types.ObjectId
) {
	const progress = await errorIfProgressNotExist(progressId)
	errorIfIdNotEqual(progress.owner, currentUserId)

	const session = await mongoose.startSession()
	session.startTransaction()
	try {
		// reduce order by 1 for all progresss after the one
		const progressesNeedUpdate = await Progress.find({
			owner: progress.owner
		})
			.where('order')
			.gt(progress.order)
		for (const progressNeedUpdate of progressesNeedUpdate) {
			progressNeedUpdate.order--
			await progressNeedUpdate.save()
		}

		await Progress.findByIdAndDelete(progress._id)
		await session.commitTransaction()
	} catch (error) {
		await session.abortTransaction()

		throw error
	} finally {
		session.endSession()
	}
}

export async function update(
	progressId: Types.ObjectId,
	updateProgress: UpdateProgress,
	currentUserId: Types.ObjectId
) {
	const progress = await errorIfProgressNotExist(progressId)
	errorIfIdNotEqual(progress.owner, currentUserId)

	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		// deal with order
		if (updateProgress.order !== undefined) {
			const count = await Progress.find({ owner: progress.owner }).count()
			updateProgress.order = Math.min(
				Math.max(0, updateProgress.order),
				count
			)

			if (updateProgress.order < progress.order) {
				const progressesNeedUpdate = await Progress.find({
					owner: progress.owner
				})
					.where('order')
					.gte(updateProgress.order)
					.lt(progress.order)
				for (const progressNeedUpdate of progressesNeedUpdate) {
					progressNeedUpdate.order++
					await progressNeedUpdate.save()
				}
			} else if (updateProgress.order > progress.order) {
				const progresssNeedUpdate = await Progress.find({
					owner: progress.owner
				})
					.where('order')
					.gt(progress.order)
					.lte(updateProgress.order)
				for (const progressNeedUpdate of progresssNeedUpdate) {
					progressNeedUpdate.order--
					await progressNeedUpdate.save()
				}
			}
		}

		for (const [key, value] of lodash.entries(updateProgress)) {
			;(progress as any)[key] = value
		}
		await progress.save()

		await session.commitTransaction()

		return (await fetch({ _id: progress._id }))[0]
	} catch (error) {
		await session.abortTransaction()

		throw error
	} finally {
		session.endSession()
	}
}
