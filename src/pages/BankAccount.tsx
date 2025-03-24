import { useNavigate, useParams } from "react-router-dom";
import BankAccountBalanceCard from "@/components/bank-account/BankAccountBalance.tsx";
import BankAccountDetailsCard from "@/components/bank-account/BankAccountDetails.tsx";
import BankAccountTransactions from "@/components/bank-account/BankAccountTransactions.tsx";
import { motion, AnimatePresence } from "framer-motion";
import BankAccountCardsCard from "@/components/bank-account/BankAccountCards.tsx";
import React, { useEffect, useState } from "react";
import {
  editAccountClient,
  getAccountById,
  getAllCreditCardsForBankAccount,
} from "@/api/bankAccount.ts";
import {
  AccountUpdateClientRequest,
  BankAccount,
} from "@/types/bankAccount.ts";
import { CardDTO } from "@/types/card.ts";
import { Toaster } from "@/components/ui/sonner";
import { showErrorToast, showSuccessToast } from "@/utils/show-toast-utils.tsx";

export default function BankAccountPage() {
  // error
  const [error, setError] = useState<string | null>(null);
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<BankAccount>();
  const [cards, setCards] = useState<CardDTO[]>([]);
  const [showDetails, setShowDetails] = React.useState(false);
  const navigate = useNavigate();

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
      showErrorToast({
        error,
        defaultMessage: "Failed to fetch bank account info",
      });
      setError("Failed to fetch bank account info");
    }
  };

  const getCards = async () => {
    try {
      setError(null);
      if (!accountId) {
        throw new Error("AccountId is missing from URL!");
      }
      const response = await getAllCreditCardsForBankAccount(accountId);

      if (!response || response.status != 200) {
        throw new Error("Failed to fetch card info");
      }
      setCards(response.data.items);
    } catch (err) {
      console.error(err);
      showErrorToast({ error, defaultMessage: "Failed to fetch card info" });
    }
  };

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

      showSuccessToast({
        title: "Edit successful!",
        description: "Account edited successfully.",
      });

      return true;
    } catch (err) {
      showErrorToast({
        error,
        defaultMessage: "Failed to edit bank account info",
      });
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    getAccountInfo();
    getCards();
  }, []);

  if (error || account == undefined)
    return (
      <h1 className="text-center text-2xl font-semibold text-destructive">
        {error}
      </h1>
    );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Toaster richColors />
      <h1 className="font-display font-bold text-5xl">
        {account.name || "An unnamed account"} overview
      </h1>
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
                onAccountNameChange={async (newValue) => {
                  return editAccount({
                    name: newValue,
                    monthlyLimit: account.monthlyLimit, //TODO: change to account.monthlyLimit - now causes error because it's 0
                    dailyLimit: account.dailyLimit, //TODO: change to account.dailyLimit - now causes error because it's 0
                  } as AccountUpdateClientRequest);
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
                onSendClick={() =>
                  navigate("/payments/new", {
                    state: { accountId: account.id },
                  })
                }
                onDetailsClick={() => setShowDetails(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <BankAccountCardsCard account={account} cards={cards} />
        <BankAccountTransactions
          className="md:col-span-2 sm:col-span-1"
          account={account}
          cardTitle="Recent transactions"
        />
      </div>
    </main>
  );
}
