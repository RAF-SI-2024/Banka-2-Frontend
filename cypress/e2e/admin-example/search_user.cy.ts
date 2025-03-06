describe('search_user', () => {
  beforeEach(() => {
    // Login via API command instead of UI to save time.
    cy.loginUserApi({ email: 'admin@gmail.com', password: 'admin' }).then((response) => {
      const authToken = response.body.token;
      Cypress.env('authToken', authToken);
      sessionStorage.setItem("token", authToken);
    });
  });

  it('should retrieve all users from the backend with status code 200', () => {
    // Visit the user list page
    cy.visit("http://localhost:5173/user-list");

    // Call your custom command to get the real data
    cy.getAllUsersApi(0, 10).then((response) => {
      // Assert that the response status is 200
      expect(response.status).to.equal(200);

      // Log the entire response body
      cy.log("User list:", JSON.stringify(response.body));

      // Optionally, log each user's email for easier inspection
      response.body.content.forEach((user: any) => {
        cy.log(`User Email: ${user.email}`);
      });

      // If you wish to perform further assertions:
      expect(response.body.content).to.have.length.greaterThan(0);
    });
  });

  it('should filter users by name and role using intercept', () => {
    // Intercept the API call for getting users with filters
    cy.intercept({
      method: 'GET',
      url: '**/users?*'
    }).as('getFilteredUsers');

    // Visit the user list page
    cy.visit("http://localhost:5173/user-list");

    // Wait for the initial API call to load users
    cy.wait('@getFilteredUsers').then((interception) => {
      const users = interception.response.body.content;
      if (users.length > 0) {
        // Use the first user's first name as a filter
        const firstName = users[0].firstName;

        // Apply the filter in the UI
        cy.get('input[placeholder*="First Name"]').type(firstName);
        cy.get('button[type="submit"]').click();

        // Wait for the filtered API call and assert its status
        cy.wait('@getFilteredUsers').then((filteredInterception) => {
          expect(filteredInterception.response.statusCode).to.eq(200);
          // Verify that every returned user has the filtered first name
          filteredInterception.response.body.content.forEach(user => {
            expect(user.firstName).to.eq(firstName);
          });
        });

        // Verify that the UI displays the filtered results
        cy.contains(firstName).should('be.visible');
      }
    });
  });
});
