const apiBaseUrl = `${Cypress.env("API_URL")}${Cypress.env("API_BASE_PATH")}`;

describe('Registration Form Tests', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

it('should complete registration process', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#firstName').type('Aleksandar');
    cy.get('#lastName').type('Ivanović');
    cy.get('#\\:r6\\:-form-item').click();
    cy.get('.rdp-dropdown_month > .bg-card').select('6'); // July is month 6 (0-indexed)
    cy.get('.rdp-dropdown_year > .bg-card').select('1995');
    cy.get(':nth-child(2) > :nth-child(3) > .rdp-button_reset').click();
    cy.get('#\\:r6\\:-form-item').click();
    cy.get('#uniqueIdentificationNumber').type('1207995710029');
    cy.get(':nth-child(1) > .border-input').click();
    cy.get('.border-transparent').click();
    cy.get('#email').type('aleksandar.ivanovic@gmail.com');
    cy.get('#\\:rf\\:-form-item').clear();
    cy.get('#\\:rf\\:-form-item').type('+381698812321');
    cy.get('#address').type('Kralja Petra 12');
    cy.get('.bg-foreground').click();
    /* ==== End Cypress Studio ==== */

    cy.intercept("POST", `${apiBaseUrl}/clients`, {
        statusCode: 200,
        body: {
            firstName: "Aleksandar",
            lastName: "Ivanović",
            dateOfBirth: "1995-07-12",
            gender: 1,
            uniqueIdentificationNumber: "1207995710029",
            email: "aleksandar.ivanovic@gmail.com",
            phoneNumber: "+381698812321",
            address: "Kralja Petra 12"
        }
    }).as("clientRegister");

    cy.contains('Continue').click();

    cy.wait("@clientRegister").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
    });


    cy.contains('Continue bank').click();
    cy.visit('/create-account')
});
});