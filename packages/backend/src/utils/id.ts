import mongoose from 'mongoose'
import { Course } from '../models/Course.js'
import { Progress } from '../models/Progress.js'
import { User } from '../models/User.js'

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
	if (!isIdEqual(id1, id2)) throw Error('3')
}

export async function errorIfUserNotExist(id: ID) {
	const user = await User.findById(toObjectId(id))
	if (!user) throw Error('4')
	return user
}

export async function errorIfCourseNotExist(id: ID) {
	const course = await Course.findById(toObjectId(id))
	if (!course) throw Error('0')
	return course
}

export async function errorIfProgressNotExist(id: ID) {
	const progress = await Progress.findById(toObjectId(id))
	if (!progress) throw Error('1')
	return progress
}
