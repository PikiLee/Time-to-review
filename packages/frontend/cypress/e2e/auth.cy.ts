import { generateAuthInfo } from "shared";

describe("register", () => {
	const { username, password } = generateAuthInfo();

	it("Should error if the username is longer than 12 characters.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-username"]')
			.type("1233456789abcde")
			.should("have.class", "is-error");
	});

	it("Should error if the username is 1 character long.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-username"]')
			.type("1")
			.should("have.class", "is-error");
	});

	it("Should error if the password is shorter than 12 characters.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]')
			.type("12345689abc")
			.should("have.class", "is-error");
	});

	it("Should error if the password does not contain number.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]')
			.type("safabcsdfs@ffsd")
			.should("have.class", "is-error");
	});

	it("Should error if the password does not contain symbol.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]')
			.type("safabcsdfsd123sdf")
			.should("have.class", "is-error");
	});

	it("register", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-username"]').type(username);
		cy.get('[data-testid="register-form-password"]').type(password);
		cy.get('[data-testid="register-form-submit"]').click();

		cy.url().should("contain", "/home");
	});

	it("Should error if the username has existed.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-username"]').type(username);
		cy.get('[data-testid="register-form-password"]').type(password);
		cy.get('[data-testid="register-form-submit"]').click();

		cy.get('[data-testid="register-form-username"]').should(
			"have.class",
			"is-error"
		);
	});
});

describe("login", () => {
	it("Username should appear when logined, vice versa", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="app-header-username"').should("not.exist");

		const { username, password } = generateAuthInfo();
		cy.register(username, password);

		cy.get('[data-testid="app-header-username"')
			.should("exist")
			.should("have.text", username);
		cy.get('[data-testid="app-header-logout"]').click({ force: true });
		cy.url().should("contain", "/login");
	});

	it("logout", () => {
		const { username, password } = generateAuthInfo();
		cy.register(username, password);

		cy.get('[data-testid="app-header-logout"]').click({ force: true });
		cy.url().should("contain", "/login");
	});

	it("Should go to home page if login succeeds", () => {
		const { username, password } = generateAuthInfo();
		cy.register(username, password);

		cy.visit("/auth/login");

		cy.get('[data-testid="register-form-username"]').type(username);
		cy.get('[data-testid="register-form-password"]').type(password);
		cy.get('[data-testid="register-form-submit"]').click();

		cy.url().should("contain", "/home");
	});

	it("Should error if the username does not exist.", () => {
		cy.visit("/auth/login");

		cy.get('[data-testid="register-form-username"]').type("a23243243224q");
		cy.get('[data-testid="register-form-password"]').type("213124124");
		cy.get('[data-testid="register-form-submit"]').click();

		cy.url().should("contain", "/login");
	});
});

describe.only("auth guard", () => {
	it("home", () => {
		cy.visit("/home");

		cy.url().should("contain", "/login");
	});

	it("courses", () => {
		cy.visit("/courses");

		cy.url().should("contain", "/login");
	});

	it("course", () => {
		cy.visit("/course/sdfsd");

		cy.url().should("contain", "/login");
	});
});
