import {useParams} from "react-router-dom";
import BankAccountBalanceCard from "@/components/bank-account/BankAccountBalance.tsx";
import BankAccountDetailsCard from "@/components/bank-account/BankAccountDetails.tsx";
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions.tsx";
import { motion, AnimatePresence } from "framer-motion";
import BankAccountCardsCard from "@/components/bank-account/BankAccountCards.tsx";
import React, {useEffect, useState} from "react";
import {editAccountClient, getAccountById, getAllCreditCardsForBankAccount} from "@/api/bankAccount.ts";
import {AccountUpdateClientRequest, BankAccount} from "@/types/bankAccount.ts";
import {CardDTO} from "@/types/card.ts";
import {showToast, Toaster} from "@/components/ui/sonner"
import {AxiosError} from "axios";




export default function BankAccountPage() {
    // error
    const [error, setError] = useState<string | null>(null);
    const { accountId } = useParams<{ accountId: string }>();
    const [account, setAccount] = useState<BankAccount>();
    const [cards, setCards] = useState<CardDTO[]>([]);
    const [showDetails, setShowDetails] = React.useState(false)

    const getAccountInfo = async () => {
        setError(null);
        if (!accountId) {
            throw new Error("AccountId is missing from URL!");
        }
        console.log("Fetching bank account info");
        try {
            const response = await getAccountById(accountId);
            if (response.status !== 200) {
                throw new Error("Failed to fetch bank account info");
            }
            setAccount(response.data);
            console.log(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch bank account info");
        }
    }

    const getCards = async () => {
        try{
            setError(null);
            if (!accountId) {
                throw new Error("AccountId is missing from URL!");
            }
            const response = await getAllCreditCardsForBankAccount(accountId);

            if(!response || response.status != 200){
                throw new Error("Failed to fetch card info");
            }
            setCards(response.data.items);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch card info");
        }
    }

    const editAccount = async (data: AccountUpdateClientRequest) => {
        if (!accountId) {
            throw new Error("AccountId is missing from URL!");
        }
        console.log("Editing bank account info");
        console.log(data);
        try {
            const response = await editAccountClient(accountId, data);
            if (response.status !== 200) {
                throw new Error("Failed to edit bank account info");
            }
            setAccount(response.data);
            console.log(response.data);

            showToast({
                title:"Edit successful!",
                variant:"success",
                description: "Account edited successfully.",
                icon: <span className="icon-[ph--check-circle] text-background text-xl"></span>
            });

            return true;
        } catch (err) {
            if (err instanceof AxiosError) {
                // Loop through each error field in the response data
                const errors = err?.response?.data?.errors || {}

                Object.entries(errors).forEach(([key, messages]) => {
                    // For each field (key), show a toast for every message in the array
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    messages.forEach((message: string) => {
                        showToast({
                            title: `Error in ${key}`,
                            variant: "error",
                            description: message,
                            icon:  <span className="icon-[ph--x-circle] text-destructive-foreground text-xl"></span>
                        })
                    })
                })
            } else {
                showToast({
                    title:"An error occured",
                    variant:"error",
                    description: "Account could not be edited.",
                    icon: <span className="icon-[ph--x-circle] text-destructive-foreground text-xl"></span>
                });
                }
            console.error(err);
            return false;
        }
    }

    useEffect(() => {
        getAccountInfo();
        getCards();
    }, [])

    if (error || account == undefined) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">{account.name || "An unnamed account"} overview</h1>
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
                                <BankAccountDetailsCard
                                    account={account}
                                    onBackClick={() => setShowDetails(false)}
                                    onAccountNameChange={async (newValue) =>{
                                        return  editAccount({
                                            name: newValue,
                                            monthlyLimit: 2000, //TODO: change to account.monthlyLimit - now causes error because it's 0
                                            dailyLimit: 2000,  //TODO: change to account.dailyLimit - now causes error because it's 0
                                        } as AccountUpdateClientRequest)
                                    }}
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

                <BankAccountCardsCard account={account} cards={cards} />
                <BankAccountTransactions className="md:col-span-2 sm:col-span-1" account={account}/>
            </div>
        </main>
    )
}
