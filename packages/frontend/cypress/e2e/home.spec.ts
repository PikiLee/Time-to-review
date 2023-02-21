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
	goToHomePage,
	goToNextStage,
	editProgress,
	deleteProgress
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

it('should not display progress if go to next stage', () => {
	const progressName = 'Essay 1'
	coursePreconditions.hasCourses({ mockEndpoint, amount: 1 })
	coursePreconditions.hasProgresses({ mockEndpoint })
	coursePreconditions.updateProgressSucceed({
		mockEndpoint,
		progressName,
		progressToUpdate: { stage: 1, isDue: false }
	})
	goToHomePage()
	goToNextStage(progressName)
	assertNotDisplay(progressName)
})

describe('Edit progress', () => {
	it('should display progress if edit a progress', () => {
		const progressName = 'Essay 1'
		const progressToUpdate = { name: 'update progress' }
		coursePreconditions.hasCourses({ mockEndpoint, amount: 1 })
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressSucceed({
			mockEndpoint,
			progressName,
			progressToUpdate
		})
		goToHomePage()
		editProgress(progressName)
		assertDisplay(progressToUpdate.name)
	})

	it('should go to courses page if delete a progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({ mockEndpoint, amount: 1 })
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.deleteProgressSucceed({
			mockEndpoint
		})
		goToHomePage()
		deleteProgress(progressName)
		assertNotDisplay(progressName)
	})

	it('show error if 400 when update progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({ mockEndpoint, amount: 1 })
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressFail({
			mockEndpoint,
			status: 400
		})
		goToHomePage()
		editProgress(progressName)
		assertDisplay('Failed to update progress.')
	})

	it('show error if 404 when update progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({ mockEndpoint, amount: 1 })
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.updateProgressFail({
			mockEndpoint,
			status: 404
		})
		goToHomePage()
		editProgress(progressName)
		assertDisplay('Progress does not exist.')
	})

	it('show error if 404 when delete progress', () => {
		const progressName = 'Essay 1'
		coursePreconditions.hasCourses({ mockEndpoint, amount: 1 })
		coursePreconditions.hasProgresses({ mockEndpoint })
		coursePreconditions.deleteProgressFail({
			mockEndpoint
		})
		goToHomePage()
		deleteProgress(progressName)
		assertDisplay('Progress does not exist.')
	})
})
