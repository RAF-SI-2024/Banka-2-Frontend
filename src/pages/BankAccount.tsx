import {useParams} from "react-router-dom";
import {BankAccount} from "@/types/bankAccount.ts";
import {Client, Employee} from "@/types/user.ts";
import {Gender, Role} from "@/types/enums.ts";
import {BankAccountType} from "@/types/bankAccountType.ts";
import {Currency} from "@/types/currency.ts"
import BankAccountBalanceCard from "@/components/bank-account/BankAccountBalance.tsx";
import BankAccountDetailsCard from "@/components/bank-account/BankAccountDetails.tsx";
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions.tsx";
import { motion, AnimatePresence } from "framer-motion";
import BankAccountCardsCard from "@/components/bank-account/BankAccountCards.tsx";
import React from "react";

const client: Client = {
    firstName: "Bosko",
    lastName: "Zlatanovic",
    dateOfBirth: "15-01-2002",
    gender: Gender.Male,
    uniqueIdentificationNumber: "112222193123",
    email: "bzlatanovic@gmail.com",
    phoneNumber: "+381 61 1111 002",
    address: "Main st 123",
}

const employee: Employee = {
    firstName: "Mihailo",
    lastName: "Radovic",
    dateOfBirth: "15-11-2002",
    gender: Gender.Male,
    uniqueIdentificationNumber: "112222193123",
    email: "mradovic@gmail.com",
    phoneNumber: "+381 62 1111 002",
    address: "Main st 123",
    username: "mradovic",
    role: Role.Employee,
    department: "IT",
    employed: true,
}

const currency: Currency = {
    id: "1",
    name: "United states dollar",
    code: "EUR",
    symbol: "$",
    countries: [],
    description: "bla bla",
    status: true,
    createdAt: new Date(),
    modifiedAt: new Date()
}

const accountType: BankAccountType = {
    id: "1",
    name: "Foreign Exchange",
    code: "aaa",
    createdAt: new Date(),
    modifiedAt: new Date()
}

const account: BankAccount = {
    id: "1",
    name: "Racun 1",
    client: client,
    accountNumber: 1111222233334444,
    balance: 99900000.25,
    employee: employee,
    currency: currency,
    accountType: accountType,
    dailyLimit: 1000,
    monthlyLimit: 10000,
    availableBalance: 1000,
    status: true,
    creationDate: new Date(),
    expirationDate: new Date(),
    createdAt: new Date(),
    modifiedAt: new Date()
}

export default function BankAccountPage() {
    const { accountId } = useParams<{ accountId: string }>();
    const [showDetails, setShowDetails] = React.useState(false)

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="font-display font-bold text-5xl">{account.name} overview</h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        {showDetails ? (
                            <motion.div
                                key="details"
                                layout
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                            >
                                <BankAccountDetailsCard
                                    account={account}
                                    onBackClick={() => setShowDetails(false)}
                                    onAccountNameChange={newValue => console.log(newValue)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="balance"
                                layout
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                            >
                                <BankAccountBalanceCard
                                    account={account}
                                    onDetailsClick={() => setShowDetails(true)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <BankAccountCardsCard account={account} />
                <BankAccountTransactions className="md:col-span-2 sm:col-span-1" account={account}/>
            </div>
        </main>
    )
}
