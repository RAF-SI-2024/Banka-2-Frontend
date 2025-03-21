import { Gender } from "@/types/enums";

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<any>;

            // EMPLOYEE
            // Bank account list
            clientRegistration(options?: {
                firstName?: string,
                lastName?: string,
                birthYear?: string,
                uid?: string,
                sex?: Gender,
                email?: string,
                phoneNumber?: string,
                address?: string
            }): Chainable<any>;

            bankAccountCreation(options?: {
                type?: string;
                ownership?: string;
                plan?: string;
                createCard?: boolean;
                currency?: string;
                cardType?: string;
                businessName?: string;
                registrationNumber?: number;
                pib?: number;
                activityCode?: string;
                address?: string;
            }): Chainable<any>;
        }
    }
}
export {};