import { generateAuthInfo } from 'shared'
import { beforeEach, it } from 'local-cypress'
import {
	assertUserIsLogin,
	mockEndpoint,
	goToRegisterPage,
	register,
	assertInHomePage,
	assertDisplay,
	assertNotDisplay,
	goToCoursePage,
	createProgress,
	goToNextStage,
	editProgress,
	deleteProgress,
	editCourse,
	assertInCoursesPage,
	deleteCourseInCoursePage,
	assertDisplayWithProgress
} from '../utils'
import * as authPreconditions from '../../src/__test__/preconditions/auth'
import * as coursePreconditions from '../../src/__test__/preconditions/course'

beforeEach(() => {
	const { username, password } = generateAuthInfo()
	authPreconditions.registerSucceed({ mockEndpoint, username })
	authPreconditions.usernameNotExist({ mockEndpoint })
	goToRegisterPage()
	register(username, password)
	assertUserIsLogin(username)
	assertInHomePage()
})

const courseId = 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6'
describe('create a progress', () => {
	it('should display progress if create a new progress', () => {
		const progressName = 'new progress'
		coursePreconditions.createProgressSucceed({
			mockEndpoint,
			progressName
		})
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		createProgress(progressName)
		assertDisplay(progressName)
	})

	it(`should error if course name'length is less than 1`, () => {
		goToCoursePage(courseId)
		createProgress('a{backspace}')
		assertDisplay('Length should be 1 to 60.')
	})

	it(`should error if course name'length is longer than 60`, () => {
		goToCoursePage(courseId)
		createProgress('a'.repeat(61))
		assertDisplay('Length should be 1 to 60.')
	})

	it(`should not error if course name'length is longer than 0 and shoter than 61`, () => {
		goToCoursePage(courseId)
		createProgress('a'.repeat(60))
		assertNotDisplay('Length should be 1 to 60.')
	})

	it(`should not error if course name'length is longer than 0 and shoter than 61`, () => {
		goToCoursePage(courseId)
		createProgress('a'.repeat(60))
		assertNotDisplay('Length should be 1 to 60.')
	})

	it('should show error if 400', () => {
		const courseName = 'new progress'
		coursePreconditions.createProgressFail({ mockEndpoint, status: 400 })
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		createProgress(courseName)
		assertDisplay('Failed to create progress.')
	})

	it('should show error if 404', () => {
		const courseName = 'new progress'
		coursePreconditions.createProgressFail({ mockEndpoint, status: 404 })
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		createProgress(courseName)
		assertDisplay('Course does not exist.')
	})
})

describe('toggle stage', () => {
	it.only('should display next stage if toggle stage', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressSucceed({
			mockEndpoint,
			progressName,
			progressToUpdate: { name: progressName, stage: 1 }
		})
		goToCoursePage(courseId)
		goToNextStage(progressName)
		assertDisplayWithProgress(progressName, 'Reviewed 1 Time')
	})

	it('show error if 400', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressFail({
			mockEndpoint,
			status: 400
		})
		goToCoursePage(courseId)
		goToNextStage(progressName)
		assertDisplay('Failed to update progress.')
	})

	it('show error if 404', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressFail({
			mockEndpoint,
			status: 404
		})
		goToCoursePage(courseId)
		goToNextStage(progressName)
		assertDisplay('Progress does not exist.')
	})
})

describe('Edit progress', () => {
	it('should display progress if edit a progress', () => {
		const progressName = 'Essay 1'
		const progressToUpdate = { name: 'update progress' }
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressSucceed({
			mockEndpoint,
			progressName,
			progressToUpdate
		})
		goToCoursePage(courseId)
		editProgress(progressName)
		assertDisplay(progressToUpdate.name)
	})

	it('should go to courses page if delete a progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.deleteProgressSucceed({
			mockEndpoint
		})
		goToCoursePage(courseId)
		deleteProgress(progressName)
		assertNotDisplay(progressName)
	})

	it('show error if 400 when update progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressFail({
			mockEndpoint,
			status: 400
		})
		goToCoursePage(courseId)
		editProgress(progressName)
		assertDisplay('Failed to update progress.')
	})

	it('show error if 404 when update progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressFail({
			mockEndpoint,
			status: 404
		})
		goToCoursePage(courseId)
		editProgress(progressName)
		assertDisplay('Progress does not exist.')
	})

	it('show error if 404 when delete progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.deleteProgressFail({
			mockEndpoint
		})
		goToCoursePage(courseId)
		deleteProgress(progressName)
		assertDisplay('Progress does not exist.')
	})
})

describe('Edit course', () => {
	it('should display course if edit a course', () => {
		const courseName = 'Introduction to Python'
		const courseToUpdate = { name: 'update course' }
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		editCourse()
		assertDisplay(courseToUpdate.name)
	})

	it('should not display course if delete a course', () => {
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.deleteCourseSucceed({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		deleteCourseInCoursePage()
		assertInCoursesPage()
	})

	it('show error if 400 when update course', () => {
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.updateCourseFail({
			mockEndpoint,
			status: 400
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		editCourse()
		assertDisplay('Failed to update course.')
	})

	it('show error if 404 when update course', () => {
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.updateCourseFail({
			mockEndpoint,
			status: 404
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		editCourse()
		assertDisplay('Course does not exist.')
	})

	it('show error if 404 when delete course', () => {
		coursePreconditions.hasCourses({
			mockEndpoint
		})
		coursePreconditions.deleteCourseFail({
			mockEndpoint
		})
		coursePreconditions.hasProgresses({ mockEndpoint })
		goToCoursePage(courseId)
		deleteCourseInCoursePage()
		assertDisplay('Course does not exist.')
	})
})
