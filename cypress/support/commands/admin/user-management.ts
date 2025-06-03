import {apiBaseUrl} from "../../commands";

// Cypress.Commands.add("getAllUsersApi", (page: number, size: number) => {
//     const authToken = window.sessionStorage.getItem("token");
//
//     return cy.request({
//         method: 'GET',
//         url: `${apiBaseUrl}/users`,
//         headers: {
//             'Authorization': `Bearer ${authToken}`
//         },
//         qs: {
//             page,
//             size
//         },
//         failOnStatusCode: false
//     });
// });