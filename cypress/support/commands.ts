const apiBaseUrl = `${Cypress.env("API_URL")}${Cypress.env("API_BASE_PATH")}`;

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

Cypress.Commands.add("getAllUsersApi", (page: number, size: number, filters: { email?: string; firstName?: string; lastName?: string; role?: string } = {}) => {
    const authToken = Cypress.env('authToken');

    return cy.request({
        method: 'GET',
        url: `${apiBaseUrl}/users`,
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        qs: {
            email: filters.email,
            firstName: filters.firstName,
            lastName: filters.lastName,
            role: filters.role ? parseInt(filters.role, 10) : undefined,
            page,
            size
        },
        failOnStatusCode: false
    });
});

export {};