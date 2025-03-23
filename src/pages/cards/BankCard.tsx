import {useNavigate, useParams} from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import React, {useEffect, useState} from "react"
import CardDetails from "@/components/card/card-single/BankCardDetails.tsx"
import BankAccountTransactions from "@/components/bank-account/bank-account-single/BankAccountTransactions.tsx"
import CardDisplay from "@/components/card/card-single/BankCardDisplay.tsx";
import {CardDTO} from "@/types/card.ts";
import { getCardById } from "@/api/card.ts"
import {getAccountById} from "@/api/bankAccount.ts";
import {BankAccount} from "@/types/bankAccount.ts";
import BankAccountBalanceCard from "@/components/bank-account/bank-account-single/BankAccountBalance.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";


export default function BankCardPage() {
    // error
    const [error, setError] = useState<string | null>(null);

    const [card, setCard] = useState<CardDTO>();

    const [bankAccount, setBankAccount] = useState<BankAccount>();

    const { cardId } = useParams<{ cardId: string }>()

    const [showDetails, setShowDetails] = React.useState(false);

    const navigate = useNavigate();

    const getCardInfo = async () => {
        setError(null);
        console.log("Fetching card info");
        if (!cardId) {
            throw new Error("CardId is missing from URL!")
        }
        try {
            const response = await getCardById(cardId);
            if (response.status !== 200) {
                throw new Error("Failed to fetch card info");
            }
            setCard(response.data);
            getAccountInfo(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch card info");
        }
    };

    const getAccountInfo = async (card: CardDTO) => {
        setError(null);
        console.log("Fetching bank account info");
        try {
            const response = await getAccountById(card.account.id);
            if (response.status !== 200) {
                throw new Error("Failed to fetch bank account info");
            }
            setBankAccount(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch bank account info");
        }
    }

    useEffect(() => {
            getCardInfo();
    },[]);


    if (error || card == null || bankAccount == null) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;



    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">{card.name}</h1>
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <AnimatePresence mode="wait">
                    {showDetails ? (
                        <motion.div
                            key="details"
                            layout
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <CardDetails card={card} onBackClick={() => setShowDetails(false)}/>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="card"
                            layout
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <CardDisplay card={card} cardHolder={card.account.client} onDetailsClick={() => setShowDetails(true)}/>

                        </motion.div>
                    )}
                </AnimatePresence>

                <BankAccountBalanceCard cardPageVersion={true}
                                        onSendClick={() => navigate('/payments/new', {state:{accountId: card?.account.id}})}
                                        onDetailsClick={() => navigate(`/bank-account/${bankAccount.id}`)}
                                        account={bankAccount} />

                <BankAccountTransactions className="md:col-span-2 sm:col-span-1" account={bankAccount} cardTitle="Card transactions"/>
            </div>
        </main>
    )

}
