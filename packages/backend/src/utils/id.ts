import mongoose from 'mongoose'
import { Course } from '../models/Course'
import { Progress } from '../models/Progress'
import { User } from '../models/User'

type ID = string | mongoose.Types.ObjectId

export function toObjectId(id: ID) {
	if (typeof id === 'string') {
		return new mongoose.Types.ObjectId(id)
	} else {
		return id
	}
}

export function resolveObjectId(id: ID) {
	return typeof id === 'string' ? id : id.toString()
}

export function isIdEqual(id1: ID, id2: ID) {
	return toObjectId(id1).equals(toObjectId(id2))
}

export function errorIfIdNotEqual(id1: ID, id2: ID) {
	if (!isIdEqual(id1, id2)) throw Error('Not authorized.')
}

export async function errorIfUserNotExist(id: ID) {
	const user = await User.findById(toObjectId(id))
	if (!user) throw Error('User not found.')
	return user
}

export async function errorIfCourseNotExist(id: ID) {
	const course = await Course.findById(toObjectId(id))
	if (!course) throw Error('Course not found.')
	return course
}

export async function errorIfProgressNotExist(id: ID) {
	const progress = await Progress.findById(toObjectId(id))
	if (!progress) throw Error('Progress not found.')
	return progress
}
