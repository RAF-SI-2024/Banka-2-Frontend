import {Gender} from "@/types/enums";

Cypress.Commands.add("clientRegistration", ({firstName = "Klijent",
                                                lastName = "Klijentic",
                                                birthYear = "1986",
                                                uid = "0101986500406",
                                                sex = Gender.Male,
                                                email = "client123456@gmail.com",
                                                phoneNumber = "069 1234567",
                                                address = "Bulevar 12"} = {}) => {



    // first form
    cy.wait(500);
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('[data-cy=date-of-birth-date]').click();
    cy.get('.rdp-dropdown_month > .bg-card').select('0');
    cy.get('.rdp-dropdown_year > .bg-card').select(birthYear);
    cy.get(':nth-child(1) > :nth-child(4) > .rdp-button_reset').click();
    cy.get('#uniqueIdentificationNumber').type(uid);
    cy.get(`[value="${sex}"]`).first().click();
    cy.get('.flex-col.gap-4 > .border-transparent').click();


    // second form
    cy.get('#email').type(email);
    cy.contains('Phone').type(phoneNumber);
    cy.get('.pt-0 > .gap-6').click();
    cy.get('#address').type(address);
    cy.get('.flex-row > .bg-foreground').click();

    cy.wait(2000);
});


Cypress.Commands.add("bankAccountCreation", ({type = "Current Account",
                                                 ownership = "Personal",
                                                 plan= "Youth Account",
                                                 createCard = true,
                                                 currency = "USD-$",
                                                 cardType = "MasterCard Gold",
                                                 businessName = "BankToo",
                                                 registrationNumber = Math.floor(Math.random() * 100000000),
                                                 pib = Math.floor(Math.random() * 1000000000),
                                                 activityCode = "11.20",
                                                 address = "Main st 12"}= {}) => {


    cy.wait(500);
    cy.get("[data-cy=account-type-select]").click();
    cy.get('[role="option"]').contains(type).click();

    cy.get("[data-cy=ownership-select]").click();
    cy.get('[role="option"]').contains(ownership).click();

    if(type !== "Current Account"){
        cy.get("[data-cy=currency-select]").click();
        cy.get('[role="option"]').contains(currency).click();
    }
    else{
        cy.get("[data-cy=plan-select]").click();
        cy.get('[role="option"]').contains(plan).click();
    }

    cy.get('[data-cy="card-radio-group"]').within(() => {
        cy.get(`[data-cy=card-radio-${createCard ? "yes": "no"}]`).should('be.visible')
            .click();
    });

    if(createCard){
        cy.get("[data-cy=card-type-select]").click();
        cy.get('[role="option"]').contains(cardType).click();
    }

    if(ownership==="Business"){
        cy.contains('button', 'Continue').click();
        cy.wait(500);

        cy.get('input[name="businessName"]').clear().type(businessName);

        cy.get('input[name="registrationNumber"]').type(registrationNumber.toString());

        cy.get('input[name="pib"]').type(pib.toString());

        cy.get('[data-cy=activity-code-dropdown]').click();
        cy.get('input[placeholder="Search activity code..."]').type(activityCode);
        cy.contains(activityCode).click();

        cy.get('input[name="address"]').click().type(address);

        cy.get('.bg-gradient-to-r > .h-9').click();
    }
    else{
        cy.get('.bg-gradient-to-r > .h-9').click();
    }

});
