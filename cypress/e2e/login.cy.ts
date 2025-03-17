import {apiBaseUrl} from "../support/commands";

beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => win.sessionStorage.clear());
});

describe("Login Page", () => {
    it("should redirect to login page", () => {
        cy.visit("/login");
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

        cy.contains("Error").should("be.visible");
    });

    it("should successfully log in with valid credentials", () => {
        cy.get("input[name='email']").type("client1@gmail.com");
        cy.get("input[name='password']").type("client1");
        cy.get("button[type='submit']").click();
    });

    it("should navigate to Forgot Password page", () => {
        cy.contains("Forgot your password?").click();
        cy.url().should("include", "/password-reset");
    });
});
