declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Logs in via UI.
             */
            login(email: string, password: string): Chainable<any>;

            /**
             * Logs in via API.
             */
            loginUserApi(data: import("../../src/types/auth.js").LoginRequest): Chainable<any>;

            /**
             * Gets all users via API.
             */
            getAllUsersApi(
                page: number,
                size: number,
                filters?: {
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