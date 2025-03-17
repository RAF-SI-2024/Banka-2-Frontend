describe('client-test', () => {
    before(() => {
        cy.session('login', () => {
            cy.loginUserApi({ email: 'client1@gmail.com', password: 'client1' }).then((response) => {
                cy.log("Login response:", response.body.token);
                cy.window().then((win) => {
                    win.sessionStorage.setItem("token", response.body.token);
                    win.sessionStorage.setItem("user", response.body.user);
                });

                // Cypress.env('authToken', window.sessionStorage.getItem("token")); // ovo ne radi
            });
        });
    });

    it('should ', () => {
        cy.visit("/home");
    });
})