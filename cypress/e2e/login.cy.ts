import {apiBaseUrl} from "./register.cy";

describe("Login Page", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/login"); // Make sure the correct URL is visited
    });

    it("should display the login form", () => {
        cy.get("input[name='email']").should("be.visible");
        cy.get("input[name='password']").should("be.visible");
        cy.contains("Log in").should("be.visible");
    });

    it("should show validation errors on empty submission", () => {
        cy.get("button[type='submit']").click();

        cy.contains("Invalid").should("be.visible");
        cy.contains("Invalid").should("be.visible");
    });

    it("should show error on invalid credentials", () => {
        cy.get("input[name='email']").type("invalid@example.com");
        cy.get("input[name='password']").type("wrongpassword");
        cy.get("button[type='submit']").click();

        cy.contains("Failed to log in").should("be.visible");
    });

    it("should successfully log in with valid credentials", () => {
        cy.intercept("POST", `${apiBaseUrl}/users/login`, {
            statusCode: 200,
            body: { user: { email: "test@example.com", password: "password123" } },
        }).as("loginRequest");

        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("password123");
        cy.get("button[type='submit']").click();

        cy.wait("@loginRequest").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });

        cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
    });

    it("should navigate to Forgot Password page", () => {
        cy.contains("Forgot your password?").click();
        cy.url().should("include", "/password-reset");
    });
});
