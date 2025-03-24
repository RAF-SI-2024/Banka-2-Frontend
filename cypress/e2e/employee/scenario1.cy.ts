
describe('Scenario 1 - Register client, create him a bank account, check if his account is in a list.', () => {
    it("Log in as employee", () => {
        cy.login("employee1@gmail.com", "employee1");
    });

    it("Click on create a new bank account button", () => {
        cy.get('.fixed > .cursor-pointer').click();
    })


    it("Register client", () => {
        cy.get('.text-card-foreground > .p-6 > .cursor-pointer').click();
        cy.clientRegistration();
    })


    it("Create a bank account", () => {
        cy.get('.items-center.gap-4 > .cursor-pointer').click();
        cy.bankAccountCreation({plan:"LLC",
            createCard: false, ownership: "Business", businessName: "BusinessNice"});
    });

    it("Check if account is created", () => {
        cy.wait(2000);

        cy.get('input[placeholder="Filter by first name"]').clear().type("Klijent")
        cy.get('input[placeholder="Filter by last name"]').clear().type("Klijentic")
        cy.contains("button", "Filter").click();

        cy.wait(1000);

        cy.get('table') // Select the table
            .contains('tr', 'LLC') // Find a row containing 'LLC'
            .contains('tr', 'Klijent') // Check if that same row contains 'Klijent'
            .contains('tr', 'Klijentic') // Check if that same row contains 'Klijentic'
            .should('exist'); // Assert that the row contains all three values
    });

});