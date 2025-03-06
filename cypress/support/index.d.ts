declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<any>;
            loginUserApi(data: import("../../src/types/auth.js").LoginRequest): Chainable<any>;
            getAllUsersApi(page: number, size: number, filters?: {
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    role?: string;
                }
            ): Chainable<any>;
        }
    }
}
export {};