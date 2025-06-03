describe('Osnovno poslovanje bank - PROVERA 3 i 4', () => {
  it('Log in as client', () => {
    cy.login("client1@gmail.com", "client1");
  })

  it('TRANSFER - isti klijent ista valuta', () => {
    cy.visit('/payments/transfer');
    cy.wait(500);

    // FROM ACCOUNT
    cy.get('[data-cy=from-account-number-transfer]').click();
    cy.get('[role="option"]').should('be.visible');
    cy.contains('[role="option"]', '222000000000000111 (RSD)').click();
    cy.get('[data-cy=from-account-number-transfer]').should('contain', '222000000000000111');

    // TO account
    cy.get('[data-cy=to-account-number-transfer]').click();
    cy.get('[role="option"]').should('be.visible');
    cy.contains('[role="option"]', '222000000000000211 (RSD)').click(); // Example TO account
    cy.get('[data-cy=to-account-number-transfer]').should('contain', '222000000000000211');

    // amount
    cy.get('#\\:rr\\:-form-item').click();
    cy.get('#\\:rr\\:-form-item').clear();
    cy.get('#\\:rr\\:-form-item').type('1.312,00');
    cy.get('#\\:rs\\:-form-item').click();
    cy.get('.shadow-sm > .h-10').click();

    // purpose
    cy.get('[data-cy=purpose-transfer]').click();
    cy.get('[data-cy=purpose-transfer]').type('ista valuta')


    // button complete transfer and x
    cy.contains('button', 'Complete transfer').click();
    cy.get('.icon-\\[ph--x\\]').click();

  });

  it('TRANSFER - isti klijent razlicita valuta', () => {
    cy.visit('/payments/transfer');
    cy.wait(500);


    // FROM ACCOUNT
    cy.get('[data-cy=from-account-number-transfer]').click();
    cy.get('[role="option"]').should('be.visible');
    cy.contains('[role="option"]', '222000000000000331 (EUR)').click();
    cy.get('[data-cy=from-account-number-transfer]').should('contain', '222000000000000331');

    // TO account
    cy.get('[data-cy=to-account-number-transfer]').click();
    cy.get('[role="option"]').should('be.visible');
    cy.contains('[role="option"]', '222000000000000441 (USD)').click(); // Example TO account
    cy.get('[data-cy=to-account-number-transfer]').should('contain', '222000000000000441');

    // amount
    cy.get('#\\:rr\\:-form-item').click();
    cy.get('#\\:rr\\:-form-item').clear();
    cy.get('#\\:rr\\:-form-item').type('1.312,00');
    cy.get('#\\:rs\\:-form-item').click();
    cy.get('.shadow-sm > .h-10').click();

    // purpose
    cy.get('[data-cy=purpose-transfer]').click();
    cy.get('[data-cy=purpose-transfer]').type('razlicita valuta')



    // button complete transfer and x
    cy.contains('button', 'Complete transfer').click();
    cy.get('.icon-\\[ph--x\\]').click();
  })

  it('TRANSACTION - dva klijenta ista valuta', () => {
    cy.login("employee1@gmail.com", "employee1");
    cy.wait(1500);

    cy.visit('/bank-account-list');
    cy.wait(500);

    cy.get('.fixed > .cursor-pointer').click();

    cy.get('#existing').click();
    cy.get('[data-cy=existing-client-email]').clear();
    cy.get('[data-cy=existing-client-email]').type('client2@gmail.com');
    cy.get('.mt-4 > .cursor-pointer').click();

    cy.bankAccountCreation({type: "Current Account", ownership: "Personal", plan: "Personal Checking Account", createCard: false, cardType: "Visa Debit"})

    cy.login("client2@gmail.com", "client2");
    cy.wait(500);

    cy.visit('/payments/new');
    cy.wait(500);


    // from account
    cy.get('[data-cy=from-account-number-transaction]').click();
    cy.get('[role="option"]').should('be.visible');
    cy.get('body')
        .find('[role="option"]')
        .contains('(RSD)')
        .click();


    // to account
    cy.get('[data-cy=to-account-number-transaction]').click();
    cy.get('.bg-popover > .border-border').clear();
    cy.get('.bg-popover > .border-border').type('222000000000000111');

    // amount
    cy.get('#\\:rr\\:-form-item').click();
    cy.get('#\\:rr\\:-form-item').clear();
    cy.get('#\\:rr\\:-form-item').type('1.312,00');
    cy.get('#\\:rs\\:-form-item').click();
    cy.get('.shadow-sm > .h-10').click();

    // purpose
    cy.get('[data-cy=purpose-transaction]').click();
    cy.get('[data-cy=purpose-transaction]').type('ista valuta')

    // send payment and x
    cy.get('.shadow-sm > .h-10').click();
    cy.get('[style="position: absolute; inset: 0px; pointer-events: none;"] > .disabled\\:cursor-not-allowed').clear();
    cy.get('[style="position: absolute; inset: 0px; pointer-events: none;"] > .disabled\\:cursor-not-allowed').type('222222');
    // cy.get('.icon-\\[ph--x\\]').click();

  })

  it('TRANSACTION - dva klijenta razlicita valuta', () => {
    cy.login("employee1@gmail.com", "employee1");
    cy.wait(500);

    cy.visit('/bank-account-list');
    cy.wait(500);

    cy.get('.fixed > .cursor-pointer').click();

    cy.get('#existing').click();
    cy.get('[data-cy=existing-client-email]').clear();
    cy.get('[data-cy=existing-client-email]').type('client2@gmail.com');
    cy.get('.mt-4 > .cursor-pointer').click();

    cy.bankAccountCreation({type: "Foreign Currency Account", currency: 'JPY', ownership: "Personal", plan: "Personal Checking Account", createCard: false, cardType: "Visa Debit"})

    cy.login("client2@gmail.com", "client2");
    cy.wait(500);

    cy.visit('/payments/new');
    cy.wait(500);

    // from account
    cy.get('[data-cy=from-account-number-transaction]').click();
    cy.get('[role="option"]').should('be.visible');
    cy.get('body')
        .find('[role="option"]')
        .contains('(JPY)')
        .click();


    // to account
    cy.get('[data-cy=to-account-number-transaction]').click();
    cy.get('.bg-popover > .border-border').clear();
    cy.get('.bg-popover > .border-border').type('222000000000000441');


    cy.get('[data-cy=to-currency-code-transaction]').click();
    cy.get('body')
        .find('[role="option"]') // or if it's SelectItem you can target it better
        .contains('USD')
        .should('be.visible')
        .click();

    // amount
    cy.get('#\\:rr\\:-form-item').click();
    cy.get('#\\:rr\\:-form-item').clear();
    cy.get('#\\:rr\\:-form-item').type('1.312,00');
    cy.get('#\\:rs\\:-form-item').click();
    cy.get('.shadow-sm > .h-10').click();

    // purpose
    cy.get('[data-cy=purpose-transaction]').click();
    cy.get('[data-cy=purpose-transaction]').type('ista valuta')

    // send payment and x
    cy.get('.shadow-sm > .h-10').click();
    cy.get('[style="position: absolute; inset: 0px; pointer-events: none;"] > .disabled\\:cursor-not-allowed').clear();
    cy.get('[style="position: absolute; inset: 0px; pointer-events: none;"] > .disabled\\:cursor-not-allowed').type('222222');

  })
})