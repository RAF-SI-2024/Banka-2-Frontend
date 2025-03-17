export const apiBaseUrl = `${Cypress.env("API_URL")}${Cypress.env("API_BASE_PATH")}`;
import api from "../../src/api/axios";



// Existing UI login command
Cypress.Commands.add("login", (email: string, password: string) => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

// New API commands
Cypress.Commands.add("loginUserApi", (data: { email: string; password: string }) => {
    return cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/users/login`,
        body: data,
        failOnStatusCode: false
    });
});

Cypress.Commands.add("getAllUsersApi", (page: number, size: number) => {
    const authToken = window.sessionStorage.getItem("token");

    return cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/users`,
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        qs: {
            page,
            size
        },
        failOnStatusCode: false
    });
});

export {};