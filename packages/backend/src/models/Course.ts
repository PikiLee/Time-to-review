import {
	createProgressProjectStage,
	createSortStage,
	Progress
} from './Progress.js'
import {
	courseStatusIndices,
	NewCourse,
	UpdateCourse,
	CourseSchema as CourseSchemaType,
	CourseStatus
} from 'shared'
import mongoose, { Schema, Types } from 'mongoose'
import lodash from 'lodash-es'
import { errorIfCourseNotExist, errorIfIdNotEqual } from '../utils/id.js'

const courseSchema = new Schema<CourseSchemaType>(
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
			required: true,
			immutable: true
		},
		status: {
			type: Number,
			enum: courseStatusIndices,
			default: 0
		},
		archived: {
			type: Boolean,
			default: false
		},
		intervals: {
			type: [Number],
			default: () => [1, 7, 14, 28]
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

export const Course = mongoose.model<CourseSchemaType>('Course', courseSchema)
;(async function () {
	await Course.createCollection()
})()

const lookupStage = {
	$lookup: {
		from: 'progresses',
		localField: '_id',
		foreignField: 'course',
		let: { c: '$$CURRENT' },
		pipeline: [
			createProgressProjectStage('$$CURRENT', '$$c'),
			createSortStage()
		],
		as: 'progresses'
	}
}

const progressIsDueFilter = {
	$filter: {
		input: '$progresses',
		as: 'item',
		cond: { $eq: ['$$item.isDue', true] }
	}
}

const dueCountField = {
	$size: progressIsDueFilter
}

const isDueField = {
	$and: [
		{
			$gt: [
				{
					$size: progressIsDueFilter
				},
				0
			]
		},
		{ $ne: ['$archived', true] },
		{ $ne: ['$status', CourseStatus.Done] }
	]
}

const projectFields = {
	name: 1,
	type: 'course',
	owner: 1,
	status: 1,
	archived: 1,
	intervals: 1,
	order: 1,
	createdAt: 1,
	updatedAt: 1,
	dueCount: dueCountField,
	isDue: isDueField,
	progressCount: { $size: '$progresses' }
}

function createProjectField(options?: {
	withProgresses?: boolean
	withDueProgresses?: boolean
}) {
	const project: any = { ...projectFields }
	if (options?.withProgresses) project.progresses = '$progresses'
	if (options?.withDueProgresses) project.dueProgresses = progressIsDueFilter
	return project
}

function createProjectStage(options?: {
	withProgresses?: boolean
	withDueProgresses?: boolean
}) {
	return {
		$project: createProjectField(options)
	}
}

const sortStage = {
	$sort: { order: 1, name: 1 }
} as const

export async function create(
	rawCourse: NewCourse,
	currentUserId: Types.ObjectId
) {
	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		const count = await Course.find({
			owner: currentUserId
		}).countDocuments({})

		const newCourse = lodash.assign(
			{},
			{
				owner: currentUserId,
				status: CourseStatus['In Progress'],
				archived: false,
				intervals: [1, 7, 14, 28],
				order: count
			},
			rawCourse
		)

		const course = new Course(newCourse)
		await course.save()

		await session.commitTransaction()

		return (await fetch({ _id: course._id }))[0]
	} catch (error) {
		await session.abortTransaction()

		throw error
	} finally {
		session.endSession()
	}
}

export async function update(
	courseId: Types.ObjectId,
	updateCourse: UpdateCourse,
	currentUserId: Types.ObjectId
) {
	const course = await errorIfCourseNotExist(courseId)
	errorIfIdNotEqual(course.owner, currentUserId)

	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		// deal with order
		if (updateCourse.order !== undefined) {
			const count = await Course.find({ owner: course.owner }).count()
			updateCourse.order = Math.min(
				Math.max(0, updateCourse.order),
				count
			)
			if (updateCourse.order < course.order) {
				const coursesNeedUpdate = await Course.find({
					owner: course.owner
				})
					.where('order')
					.gte(updateCourse.order)
					.lt(course.order)
				for (const courseNeedUpdate of coursesNeedUpdate) {
					courseNeedUpdate.order++
					await courseNeedUpdate.save()
				}
			} else if (updateCourse.order > course.order) {
				const coursesNeedUpdate = await Course.find({
					owner: course.owner
				})
					.where('order')
					.gt(course.order)
					.lte(updateCourse.order)
				for (const courseNeedUpdate of coursesNeedUpdate) {
					courseNeedUpdate.order--
					await courseNeedUpdate.save()
				}
			}
		}

		if (updateCourse.intervals) {
			// update stage in child progresses if the intervals of the course are being modified.
			const oldIntervalLength = course.intervals.length
			const newIntervalLength = updateCourse.intervals.length

			if (oldIntervalLength > newIntervalLength) {
				const children = await Progress.find({ course: course._id })
				for (const child of children) {
					if (child.stage > newIntervalLength) {
						child.stage = newIntervalLength
					}
					await child.save()
				}
			}
		}

		for (const [key, value] of lodash.entries(updateCourse)) {
			;(course as any)[key] = value
		}
		await course.save()

		await session.commitTransaction()

		return (await fetch({ _id: course._id }))[0]
	} catch (error) {
		await session.abortTransaction()

		throw error
	} finally {
		session.endSession()
	}
}

export async function del(
	courseId: Types.ObjectId,
	currentUserId: Types.ObjectId
) {
	const course = await errorIfCourseNotExist(courseId)
	errorIfIdNotEqual(course.owner, currentUserId)

	const session = await mongoose.startSession()

	session.startTransaction()
	try {
		// reduce order by 1 for all courses after the one
		const coursesNeedUpdate = await Course.find({
			owner: course.owner
		})
			.where('order')
			.gt(course.order)
		for (const courseNeedUpdate of coursesNeedUpdate) {
			courseNeedUpdate.order--
			await courseNeedUpdate.save()
		}

		await Course.findByIdAndDelete(course._id)
		await session.commitTransaction()
	} catch (error) {
		await session.abortTransaction()

		throw error
	} finally {
		session.endSession()
	}
}

/**
 * fetch a course by id
 */
export async function fetch(filter: Partial<CourseSchemaType>) {
	const result = await Course.aggregate([
		{ $match: filter },
		lookupStage,
		createProjectStage(),
		sortStage
	])

	return result
}
