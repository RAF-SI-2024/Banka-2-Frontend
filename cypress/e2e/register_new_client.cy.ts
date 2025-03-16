describe('Register Client and make him a bank account', () => {
    beforeEach(() => {
        // Clear cookies and localStorage to ensure we're not already logged in
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => win.sessionStorage.clear());
    });

    it('should register a new client and create bank account', () => {

        cy.visit("/login");

        // Wait for the React app to load and render the login form
        cy.get('#root').should('not.be.empty');

        // Use a more reliable wait strategy - wait for login form to be fully rendered
        cy.get('#email', { timeout: 10000 }).should('be.visible');

        // Now proceed with the test
        cy.get('#email').type('employee1@gmail.com');
        cy.get('#password').type('employee1');
        cy.get('.shadow-sm > .h-9').click();

        // Add a wait after login to ensure dashboard loads
        cy.url().should('not.include', '/login', { timeout: 10000 });

        cy.get('.fixed > .cursor-pointer').click();
        cy.get('.text-card-foreground > .p-6 > .cursor-pointer').click();

        // Form fill-out
        cy.get('#firstName').should('be.visible').type('Bosko');
        cy.get('#lastName').clear().type('Zlatanovic');
        cy.contains('Date of birth').click();
        cy.get('.rdp-dropdown_month > .bg-card').select('0');
        cy.get('.rdp-dropdown_year > .bg-card').select('2003');
        cy.get(':nth-child(3) > :nth-child(3) > .rdp-button_reset').click();
        cy.get('#uniqueIdentificationNumber').type('1401003710252');
        cy.get('[value="1"]').first().click();
        // cy.get('#\\:r1d\\:-form-item > :nth-child(1) > .border-input').click();
        cy.get('.flex-col.gap-4 > .border-transparent').click();
        cy.get('#email').type('bzlatanovic3621rn@raf.rs');
        cy.contains('Phone').type('069 1234567');
        // cy.get('#\\:r1j\\:-form-item').type('069 1234567');
        cy.get('.pt-0 > .gap-6').click();
        cy.get('#address').type('Bulevar 12');
        cy.get('#address').click();
        cy.get('.flex-row > .bg-foreground').click();
        cy.wait(5000);
        cy.get('.items-center.gap-4 > .cursor-pointer').click();
        cy.get('body').click({ force: true });
        cy.get('body').click({ force: true });
        cy.wait(2000);
        try{
            cy.get('.bg-gradient-to-r > .h-9').click();
        }catch (e){
            cy.log(e);
        }

    });
});