import { generateAuthInfo } from 'shared'

describe('register', () => {
	const { username, password } = generateAuthInfo()

	it('Should error if the username is longer than 12 characters.', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-username"]')
			.type('1233456789abcde')
			.should('have.class', 'is-error')
	})

	it('Should error if the username is 1 character long.', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-username"]')
			.type('1')
			.should('have.class', 'is-error')
	})

	it('Should error if the password is shorter than 12 characters.', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-password"]')
			.type('12345689abc')
			.should('have.class', 'is-error')
	})

	it('Should error if the password does not contain number.', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-password"]')
			.type('safabcsdfs@ffsd')
			.should('have.class', 'is-error')
	})

	it('Should error if the password does not contain symbol.', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-password"]')
			.type('safabcsdfsd123sdf')
			.should('have.class', 'is-error')
	})

	it('register', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-username"]').type(username)
		cy.get('[data-testid="register-form-password"]').type(password)
		cy.get('[data-testid="register-form-submit"]').click()

		cy.url().should('contain', '/home')
	})

	it('Should error if the username has existed.', () => {
		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-username"]').type(username)
		cy.get('[data-testid="register-form-password"]').type(password)
		cy.get('[data-testid="register-form-submit"]').click()

		cy.get('[data-testid="register-form-username"]').should(
			'have.class',
			'is-error'
		)
	})
})

describe('others', () => {
	const { username, password } = generateAuthInfo()
	before(() => {
		cy.register(username, password)
	})

	describe('login', () => {
		it('Username should appear and go to home page when logined', () => {
			cy.visit('/auth/login')

			cy.get('[data-testid="register-form-username"]').type(username)
			cy.get('[data-testid="register-form-password"]').type(password)
			cy.get('[data-testid="register-form-submit"]').click()

			cy.get('[data-testid="app-header-username"]')
				.should('exist')
				.should('have.text', username)

			cy.url().should('contain', '/home')
		})

		it('Should error if the username does not exist.', () => {
			cy.visit('/auth/login')

			cy.get('[data-testid="register-form-username"]').type(
				'a23243243224q'
			)
			cy.get('[data-testid="register-form-password"]').type('213124124')
			cy.get('[data-testid="register-form-submit"]').click()

			cy.url().should('contain', '/login')
		})
	})

	describe('logout', () => {
		beforeEach(() => {
			cy.login(username, password)
		})

		it('logout', () => {
			cy.get('[data-testid="app-header-logout"]')
				.click({ force: true })
				.should('not.exist')

			cy.get('[data-testid="app-header-username"').should('not.exist')
			cy.url().should('contain', '/login')
		})
	})

	describe('auth guard after login', () => {
		const { username, password } = generateAuthInfo()
		before(() => {
			cy.register(username, password)
		})

		beforeEach(() => {
			cy.login(username, password)
		})

		it('home', () => {
			cy.getBySelector('app-header-home').click()

			cy.getBySelector('home-view-title').should('exist')
		})

		it('courses', () => {
			cy.getBySelector('app-header-courses').click()

			cy.getBySelector('courses-view').should('exist')
		})
	})
})

describe('auth guard when not login', () => {
	it('home', () => {
		cy.visit('/home')

		cy.url().should('contain', '/login')
	})

	it('courses', () => {
		cy.visit('/courses')

		cy.url().should('contain', '/login')
	})

	it('course', () => {
		cy.visit('/course/sdfsd')

		cy.url().should('contain', '/login')
	})
})
