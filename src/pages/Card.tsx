import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { Client, Employee } from "@/types/user"
import { Gender, Role } from "@/types/enums"
import { Card as CardType } from "@/types/card"
import { CardType as CardKind } from "@/types/cardType"
import { BankAccountType } from "@/types/bankAccountType"
import { Currency } from "@/types/currency"
import { BankAccount } from "@/types/bankAccount"
import CardDetails from "@/components/card/BankCardDetails.tsx"
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions"
import CardDisplay from "@/components/card/BankCard.tsx";

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
    name: "Euro",
    code: "EUR",
    symbol: "€",
    countries: [],
    description: "bla bla",
    status: true,
    createdAt: new Date(),
    modifiedAt: new Date(),
}

const accountType: BankAccountType = {
    id: "1",
    name: "Foreign Exchange",
    code: "aaa",
    createdAt: new Date(),
    modifiedAt: new Date(),
}

const account: BankAccount = {
    id: "1",
    name: "Card account",
    client: client,
    accountNumber: 1111222233334444,
    balance: 9500.5,
    employee: employee,
    currency: currency,
    accountType: accountType,
    dailyLimit: 1000,
    monthlyLimit: 5000,
    availableBalance: 3000,
    status: true,
    creationDate: new Date(),
    expirationDate: new Date(),
    createdAt: new Date(),
    modifiedAt: new Date(),
}

const cardKind: CardKind = {
    id: "1",
    name: "Debit",
    createdAt: new Date(),
    modifiedAt: new Date(),
}

const cards: CardType[] = [
    {
        id: "1",
        type: cardKind,
        number: "4111 1111 1111 9743",
        name: "Visa",
        expiresAt: new Date("2027-09-30"),
        account: account,
        cvv: "123",
        limit: 10000,
        status: false,
        createdAt: new Date(),
        modifiedAt: new Date(),
    },
    {
        id: "2",
        type: cardKind,
        number: "5555 5555 5555 4444",
        name: "Mastercard",
        expiresAt: new Date("2025-06-30"),
        account: account,
        cvv: "321",
        limit: 5000,
        status: false,
        createdAt: new Date(),
        modifiedAt: new Date(),
    },
]

export default function CardPage() {
    const { cardId } = useParams<{ cardId: string }>()
    const [showDetails, setShowDetails] = React.useState(false)

    const selectedCard = cards.find((c) => c.id === cardId)
    if (!selectedCard) return <div>Card not found</div>

    const sessionUserRaw = sessionStorage.getItem("user")
    let cardHolder = "Unknown User"
    let parsedUser = null

    try {
        parsedUser = sessionUserRaw ? JSON.parse(sessionUserRaw) : null
        if (parsedUser?.firstName && parsedUser?.lastName) {
            cardHolder = `${parsedUser.firstName} ${parsedUser.lastName}`
        }
    } catch (e) {
        console.error("Invalid user in sessionStorage", e)
    }

    const realClient: Client = parsedUser
        ? {
            ...selectedCard.account.client,
            firstName: parsedUser.firstName,
            lastName: parsedUser.lastName,
        }
        : selectedCard.account.client

    const finalAccount: BankAccount = {
        ...selectedCard.account,
        client: realClient,
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="font-display font-bold text-5xl">Card overview</h1>

            <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        {showDetails ? (
                            <motion.div
                                key="details"
                                layout
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="h-full space-y-4"
                            >
                                <CardDetails card={selectedCard} account={finalAccount} onBackClick={() => setShowDetails(false)}/>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="card"
                                layout
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="h-full space-y-4"
                            >
                                <CardDisplay card={selectedCard} cardHolder={cardHolder} onDetailsClick={() => setShowDetails(true)}/>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="hidden md:block md:col-span-1" />

                <BankAccountTransactions className="col-span-2" account={finalAccount} />
            </div>
        </main>
    )

}
