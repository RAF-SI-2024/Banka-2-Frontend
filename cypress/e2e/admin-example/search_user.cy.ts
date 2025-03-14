describe('search_user', () => {

  before(() => {
    cy.session('login', () => {
      cy.loginUserApi({ email: 'admin@gmail.com', password: 'admin' }).then((response) => {
        cy.log("Login response:", response.body.token);
        cy.window().then((win) => {
          win.sessionStorage.setItem("token", response.body.token);
            win.sessionStorage.setItem("user", response.body.user);
        });

        Cypress.env('authToken', window.sessionStorage.getItem("token"));
      });
    });
  });


  it('should retrieve all users from the backend with status code 200', () => {
    cy.log("Auth token:", window.sessionStorage.getItem("token"));
    cy.visit("http://localhost:5173/home");

    cy.getAllUsersApi(1, 10).then((response) => {
      expect(response.status).to.equal(200);
      cy.log("User list:", JSON.stringify(response.body));
      expect(response.body.items).to.have.length.greaterThan(0);
    });
  });

  // it('should filter users by name and role', () => {
  //   cy.intercept('GET', '**/users?*').as('getFilteredUsers');
  //
  //   cy.visit("http://localhost:5173/home");
  //
  //   cy.wait('@getFilteredUsers').then((interception) => {
  //     expect(interception.response.statusCode).to.eq(200);
  //     const users = interception.response.body.content;
  //
  //     if (users.length > 0) {
  //       const firstName = users[0].firstName;
  //       cy.get('input[placeholder*="First Name"]').type(firstName);
  //       cy.get('button[type="submit"]').click();
  //
  //       cy.wait('@getFilteredUsers').then((filtered) => {
  //         expect(filtered.response.statusCode).to.eq(200);
  //         filtered.response.body.content.forEach(user => {
  //           expect(user.firstName).to.eq(firstName);
  //         });
  //       });
  //
  //       cy.contains(firstName).should('be.visible');
  //     }
  //   });
  // });
});
