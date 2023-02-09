import { NewProgress, UpdateProgress } from 'shared'
import mongoose, { Types } from 'mongoose'
import { ProgressSchema as ProgressSchemaType } from 'shared'
import { Course } from './Course.js'
import lodash from 'lodash-es'
import User from './User.js'
import dayjs from 'dayjs'

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
		$sort: { order: 1 }
	} as const
}

export async function fetch(
	_id: Types.ObjectId,
	options?: {
		userId?: Types.ObjectId
	}
) {
	const filter = { _id } as ProgressSchemaType
	if (options?.userId) filter.owner = options.userId
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
	if (doc.length > 0) {
		return doc[0]
	} else {
		throw Error('Not Found')
	}
}

export async function create(newProgress: NewProgress) {
	const user = await User.findById(newProgress.owner)
	if (!user) throw Error('User not found.')

	const course = await Course.findById(newProgress.course)
	if (!course) throw Error('Course not found.')
	if (!course.owner.equals(user._id)) throw new Error('Not authorized.')

	const progress = new Progress(newProgress)
	await progress.save()
	return await fetch(progress._id)
}

export async function del(
	_id: Types.ObjectId,
	options?: {
		userId?: Types.ObjectId
	}
) {
	const filter = { _id } as ProgressSchemaType
	if (options?.userId) filter.owner = options.userId
	return !!(await Progress.findOneAndDelete(filter))
}

export async function update(
	_id: Types.ObjectId,
	updateProgress: UpdateProgress,
	options?: {
		userId?: Types.ObjectId
	}
) {
	const progress = await Progress.findById(_id)
	if (!progress) throw new Error('Progress not found.')

	if (options?.userId && !progress.owner.equals(options?.userId))
		throw new Error('Not authorized.')

	for (const [key, value] of lodash.entries(updateProgress)) {
		;(progress as any)[key] = value
	}
	await progress.save()
	return await fetch(progress._id)
}
