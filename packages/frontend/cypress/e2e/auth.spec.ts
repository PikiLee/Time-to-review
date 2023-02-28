import { generateAuthInfo } from 'shared'
import { it } from 'local-cypress'
import {
	assertUserIsLogin,
	mockEndpoint,
	goToRegisterPage,
	register,
	assertInHomePage,
	inputUsername,
	assertDisplay,
	inputPassword,
	assertNotDisplay,
	goToLoginPage,
	login,
	assertInLoginPage,
	goToHomePage,
	goToCoursesPage,
	goToCoursePage
} from '../utils'
import * as authPreconditions from '../../src/__test__/preconditions/auth'

describe('register', () => {
	it('should login if user register', () => {
		const { username, password } = generateAuthInfo()
		authPreconditions.registerSucceed({ mockEndpoint, username })
		authPreconditions.usernameNotExist({ mockEndpoint })
		goToRegisterPage()
		register(username, password)
		assertUserIsLogin(username)
		assertInHomePage()
	})

	it('should error if server is down if user register', () => {
		const { username, password } = generateAuthInfo()
		authPreconditions.registerServerDown({ mockEndpoint })
		authPreconditions.usernameNotExist({ mockEndpoint })
		goToRegisterPage()
		register(username, password)
		assertDisplay('Server is down.')
	})
})

describe('login', () => {
	it('should login if user login', () => {
		const { username, password } = generateAuthInfo()
		authPreconditions.loginSucceed({ mockEndpoint, username })
		authPreconditions.usernameNotExist({ mockEndpoint })
		goToLoginPage()
		login(username, password)
		assertUserIsLogin(username)
		assertInHomePage()
	})

	it('should error if server is down if user login', () => {
		const { username, password } = generateAuthInfo()
		authPreconditions.loginServerDown({ mockEndpoint })
		authPreconditions.usernameNotExist({ mockEndpoint })
		goToLoginPage()
		login(username, password)
		assertDisplay('Server is down.')
	})
})

describe('Username validations', () => {
	const LENGTH_ERROR = 'Length should be 2 to 12.'
	it('should show error message if username is less than 2', () => {
		goToRegisterPage()
		inputUsername('a')
		assertDisplay(LENGTH_ERROR)
	})

	it('should show error message if username is longer than 12', () => {
		authPreconditions.usernameNotExist({ mockEndpoint })
		goToRegisterPage()
		inputUsername('1'.repeat(13))
		assertDisplay(LENGTH_ERROR)
	})

	it('should not show error message if username is longer than 1 and shorter than 13', () => {
		goToRegisterPage()
		inputUsername('1'.repeat(2))
		assertNotDisplay(LENGTH_ERROR)
	})

	it('should not show error message if username is longer than 1 and shorter than 13', () => {
		goToRegisterPage()
		inputUsername('1'.repeat(2))
		assertNotDisplay(LENGTH_ERROR)
	})

	it('should show error message if username has existed.', () => {
		const { username } = generateAuthInfo()
		authPreconditions.usernameExist({ mockEndpoint })
		goToRegisterPage()
		inputUsername(username)
		assertDisplay('The username has existed.')
	})
})

describe('Password validations', () => {
	const LENGTH_ERROR = 'Length should be 12 to 24.'
	it('should show error message if password is less than 12.', () => {
		authPreconditions.usernameExist({ mockEndpoint })
		goToRegisterPage()
		inputPassword('1'.repeat(11))
		assertDisplay(LENGTH_ERROR)
	})

	it('should show error message if password is longer than 24.', () => {
		authPreconditions.usernameExist({ mockEndpoint })
		goToRegisterPage()
		inputPassword('1'.repeat(25))
		assertDisplay(LENGTH_ERROR)
	})

	it('should not show error message if password is longer than 11 and shorter than 25', () => {
		goToRegisterPage()
		inputPassword('1'.repeat(12))
		assertNotDisplay(LENGTH_ERROR)
	})

	it('should not show error message if password is longer than 11 and shorter than 25', () => {
		goToRegisterPage()
		inputPassword('1'.repeat(24))
		assertNotDisplay(LENGTH_ERROR)
	})

	it('should show error message if password is longer than 11 and shorter than 25, but not contains number.', () => {
		authPreconditions.usernameExist({ mockEndpoint })
		goToRegisterPage()
		inputPassword('a'.repeat(12) + '@')
		assertDisplay(`Should contain at least one of !@#$%^&*, one number`)
	})

	it('should show error message if password is longer than 11 and shorter than 25, but not contains !@#$%^&*.', () => {
		authPreconditions.usernameExist({ mockEndpoint })
		goToRegisterPage()
		inputPassword('a'.repeat(12) + '12')
		assertDisplay(`Should contain at least one of !@#$%^&*, one number`)
	})
})

describe('auth guard', () => {
	it('should go to login page if auth guard triggered', () => {
		goToHomePage()
		assertInLoginPage()
		assertDisplay('Please login first.')
	})

	it('should go to login page if auth guard triggered', () => {
		goToCoursesPage()
		assertInLoginPage()
		assertDisplay('Please login first.')
	})

	it('should go to login page if auth guard triggered', () => {
		goToCoursePage('1')
		assertInLoginPage()
		assertDisplay('Please login first.')
	})
})
