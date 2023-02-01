import { generateAuthInfo, getPasswordValidationRegex } from "shared";

describe("register", () => {
	// const { username, password } = generateAuthInfo();

	it("Should error if the username is longer than 12 characters.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-username"]').type("1233456789abcd");

		cy.contains(
			'[data-testid="register-form-username"]',
			"Length should be 2 to 12"
		);
	});

	it("Should error if the username is 1 character long.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-username"]').type("1");

		cy.contains(
			'[data-testid="register-form-username"]',
			"Length should be 2 to 12"
		);
	});

	it("Should error if the password is shorter than 12 characters.", () => {
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]').type("12345689abc");

		cy.contains(
			'[data-testid="register-form-password"]',
			"Length should be 12 to 24"
		);
	});

	it("Should error if the password does not contain number.", () => {
		const { errorMsg } = getPasswordValidationRegex();
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]').type("safabcsdfs@ffsd");

		cy.contains('[data-testid="register-form-password"]', errorMsg);
	});

	it("Should error if the password does not contain symbol.", () => {
		const { errorMsg } = getPasswordValidationRegex();
		cy.visit("/auth/register");

		cy.get('[data-testid="register-form-password"]').type("safabcsdfsd123sdf");

		cy.contains('[data-testid="register-form-password"]', errorMsg);
	});
});
