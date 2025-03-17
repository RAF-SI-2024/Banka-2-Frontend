declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<any>;
            loginUserApi(data: import("../../src/types/auth.ts").LoginRequest): Chainable<any>;
            getAllUsersApi(page: number, size: number
            ): Chainable<any>;
        }
    }
}
export {};