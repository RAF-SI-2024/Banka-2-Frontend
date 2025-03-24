// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// AUTHORIZATION
import "./commands/authorization"

// ADMIN
import "./commands/admin/user-list"

// CLIENT
// LOAN
import "./commands/client/loan/my-loans"
import "./commands/client/loan/new-loan-request"
// PAYMENT
import "./commands/client/payment/exchange-rate-list"
import "./commands/client/payment/my-payments"
import "./commands/client/payment/new-payment"
import "./commands/client/payment/new-transfer-exchange"
// BANK ACCOUNTS
import "./commands/client/bank-account"
// CARDS
import "./commands/client/card"
// HOME
import "./commands/client/home"

// EMPLOYEE
// LOAN
import "./commands/employee/loan/all-loans";
import "./commands/employee/loan/loan-requests";
// BANK ACCOUNT LIST
import "./commands/employee/bank-account-list";
// CLIENT LIST
import "./commands/employee/client-list";
