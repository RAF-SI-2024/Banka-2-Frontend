
describe('Register Client and make him a bank account', () => {

    it("Log in as employee", () => {
        cy.login("employee1@gmail.com", "employee1");
    });

    it("Click on create a new bank account button", () => {
        cy.get('.fixed > .cursor-pointer').click();
    })

    it("Click on register a new client", () => {
        cy.get('.text-card-foreground > .p-6 > .cursor-pointer').click();
    });

    it("Fill out the first registration form", () => {
        cy.get('#firstName').should('be.visible').type('Klijent');
        cy.get('#lastName').clear().type('Klijentic');
        cy.contains('Date of birth').click();
        cy.get('.rdp-dropdown_month > .bg-card').select('0');
        cy.get('.rdp-dropdown_year > .bg-card').select('1986');
        cy.get(':nth-child(1) > :nth-child(4) > .rdp-button_reset').click();
        cy.get('#uniqueIdentificationNumber').type('0101986500406');
        cy.get('[value="1"]').first().click();
        cy.get('.flex-col.gap-4 > .border-transparent').click();
    });

    it("Fill out the second registration form", () => {
        cy.get('#email').type('client1232113423@gmail.rs');
        cy.contains('Phone').type('069 1234567');
        cy.get('.pt-0 > .gap-6').click();
        cy.get('#address').type('Bulevar 12');
        cy.get('#address').click();
        cy.get('.flex-row > .bg-foreground').click();

        cy.wait(2000);
    });

    it("Create a bank account", () => {
        cy.get('.items-center.gap-4 > .cursor-pointer').click();
        cy.get('body').click({ force: true });
        cy.get('body').click({ force: true });
        cy.get('.bg-gradient-to-r > .h-9').click();
    });

});