import { NewProgress, UpdateProgress } from 'shared'
import mongoose, { Types } from 'mongoose'
import { ProgressSchema as ProgressSchemaType } from 'shared'
import lodash from 'lodash-es'
import dayjs from 'dayjs'
import {
	errorIfCourseNotExist,
	errorIfIdNotEqual,
	errorIfProgressNotExist,
	errorIfUserNotExist
} from '../utils/id'

const { Schema } = mongoose

const progressSchema = new Schema<ProgressSchemaType>(
	{
		name: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 60
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
			required: true,
			set(lastDate: string) {
				return dayjs(lastDate).toDate()
			}
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

export async function fetch(filter: Partial<ProgressSchemaType>) {
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

	if (doc.length === 0) throw Error('Not found')
	return doc
}

export async function create(
	newProgress: NewProgress,
	options?: {
		currentUserId?: Types.ObjectId // for check whether the owner of the course is the same as current user
	}
) {
	const user = await errorIfUserNotExist(newProgress.owner)
	// check if the owner is the same as current user
	if (options?.currentUserId)
		errorIfIdNotEqual(user._id, options.currentUserId)

	const course = await errorIfCourseNotExist(newProgress.course)
	// check if the owner of the course is the same as the one in newProgress
	errorIfIdNotEqual(course.owner, user._id)

	const count = await Progress.find({ owner: user._id }).count()
	const progress = new Progress({ ...newProgress, order: count })
	await progress.save()
	return (await fetch({ _id: progress._id }))[0]
}

export async function del(
	progressId: Types.ObjectId,
	options?: {
		currentUserId?: Types.ObjectId
	}
) {
	const progress = await errorIfProgressNotExist(progressId)
	if (options?.currentUserId)
		errorIfIdNotEqual(progress.owner, options.currentUserId)

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
	options?: {
		currentUserId?: Types.ObjectId
	}
) {
	const progress = await errorIfProgressNotExist(progressId)
	if (options?.currentUserId)
		errorIfIdNotEqual(progress.owner, options.currentUserId)

	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		// deal with order
		if (updateProgress.order !== undefined) {
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
