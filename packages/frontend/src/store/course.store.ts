import { defineStore } from 'pinia'
import {
	type Course,
	CourseStatus,
	type Progress,
	type CourseWithProgress,
	type CourseWithDueProgresses
} from 'shared'
import { ref } from 'vue'
import { useArrayFilter } from '@vueuse/shared'

export const useCourseStore = defineStore('course', () => {
	const courses = ref<Course[]>([])

	const dueCourses = ref<CourseWithDueProgresses[]>([])

	const coursesInProgress = useArrayFilter(
		courses,
		(course) =>
			course.status === CourseStatus['In Progress'] &&
			course.archived === false
	)

	const coursesDone = useArrayFilter(
		courses,
		(course) =>
			course.status === CourseStatus.Done && course.archived === false
	)

	const coursesArchived = useArrayFilter(courses, (course) => course.archived)

	function find(_id: string) {
		return courses.value.find((course) => course._id === _id)
	}

	function del(_id: string) {
		const idx = courses.value.findIndex((course) => course._id === _id)
		courses.value.splice(idx, 1)
	}

	function replaceCourse(replace: Course) {
		const course = find(replace._id)
		if (course) {
			courses.value = courses.value.map((course) => {
				if (course._id === replace._id) {
					return replace
				} else {
					return course
				}
			})
			return true
		} else {
			return false
		}
	}

	function findProgress(course: Course, _id: string) {
		if (!currentCourse.value) throw Error('Can not find course')
		return currentCourse.value.progresses.find(
			(progress) => progress._id === _id
		)
	}

	function replaceProgress(replace: Progress) {
		if (!currentCourse.value) throw Error('Can not find course')
		currentCourse.value.progresses = currentCourse.value.progresses.map(
			(progress) => {
				if (progress._id === replace._id) {
					return replace
				} else {
					return progress
				}
			}
		)
	}

	function delProgress(progressId: String) {
		if (!currentCourse.value) throw Error('Can not find course')
		const idx = currentCourse.value.progresses.findIndex(
			(progress) => progress._id === progressId
		)
		if (idx !== -1) {
			currentCourse.value.progresses.splice(idx, 1)
		}
	}

	const currentCourse = ref<CourseWithProgress>()

	// function exchangeProgresses(idx1: number, idx2: number) {
	// 	if (!currentCourse.value) throw new Error("currentCourse does not exist.")
	// 	if (idx1 === idx2) return
	// 	const front = Math.min(idx1, idx2)
	// 	const after = Math.max(idx1, idx2)

	// 	const afterProgress = currentCourse.value.progresses.splice(after, 1)
	// }

	return {
		courses,
		dueCourses,
		currentCourse,
		coursesInProgress,
		coursesDone,
		coursesArchived,
		find,
		replaceCourse,
		del,
		findProgress,
		replaceProgress,
		delProgress
	}
})
