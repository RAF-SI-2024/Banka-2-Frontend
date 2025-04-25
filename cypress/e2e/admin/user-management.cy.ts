describe('Upravljanje korisnicima - PROVERA 1 i 2', () => {
      it('login as admin', function () {
        cy.login('admin@gmail.com', 'admin');
      });

      it('register a new employee', function () {
        // cy.get('.shadow-sm > .h-9').click();
        cy.get('.fixed > .cursor-pointer').click();
        cy.get('#firstName').type('Klijent');
        cy.get('#lastName').clear();
        cy.get('#lastName').type('Klijentic');
        cy.get('[data-cy="date-of-birth-date"]').click();
        cy.get('.rdp-dropdown_month > .bg-card').select('0');
        cy.get('.rdp-dropdown_year > .bg-card').select('1986');
        cy.get(':nth-child(1) > :nth-child(4) > .rdp-button_reset').click();
        cy.get('#uniqueIdentificationNumber').type('0101986500406');
        cy.get('#\\:r1v\\:-form-item > :nth-child(1) > .border-input').click();
        cy.get('.flex-col.gap-4 > .border-transparent').click();
        cy.get('#username').type('klijent');
        cy.get('#email').clear();
        cy.get('#email').type('klijent@gmail.com');
        cy.get('#\\:r26\\:-form-item').type('+381 62 1928321');
        cy.get('#address').click();
        cy.get('#address').type('Main Street 12');
        cy.get('#department').clear();
        cy.get('#department').type('IT');
        cy.get('.bg-foreground').click();
        cy.get('.shadow-sm > .h-9').click();
        cy.get(':nth-child(3) > .icon-\\[ph--caret-right\\]').click();
      });


      it('deactivate employee', function () {
        cy.get('.w-88').type('employee2');
        cy.get('.space-x-2 > .bg-primary').click();
        cy.get('[data-cy=three-dots-action-user]').click();
        cy.contains('Edit User').click();
        cy.contains('Activated').click();
        cy.contains('Update').click();
      })

      it('logout and login as registered employee', function () {
        cy.login('employee1@gmail.com', 'employee1');
      })
});