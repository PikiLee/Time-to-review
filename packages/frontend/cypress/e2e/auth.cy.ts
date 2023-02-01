import { generateAuthInfo, getPasswordValidationRegex } from "shared";

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
		const { errorMsg } = getPasswordValidationRegex();
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]')
			.type("safabcsdfs@ffsd")
			.should("have.class", "is-error");
	});

	it("Should error if the password does not contain symbol.", () => {
		const { errorMsg } = getPasswordValidationRegex();
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
