import {
    Transaction,
    TransactionResponse,
    TransactionStatus,
    TransactionTableRow,
    TransactionType
} from "@/types/transaction.ts";
import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {getAccountById, getAllAccountClientWithFilters, getAllAccountsClient,} from "@/api/bank-account.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {getAccountTransactions, getAllTransactions, getNewTransactions} from "@/api/transaction.ts";

export const getTransactionStatusBadge = (status: TransactionStatus) => {
    let variant: "success" | "destructive" | "warning" | "outline" | null | undefined;
    let text;
    switch (status) {
        case TransactionStatus.Invalid:
            variant = "destructive";
            text = "Invalid";
            break;
        case TransactionStatus.Pending:
            variant = "warning";
            text = "Pending";
            break;
        case TransactionStatus.Canceled:
            variant = "outline";
            text = "Canceled";
            break;

        case TransactionStatus.Affirm:
            variant = "outline";
            text = "Affirm";
            break;
        case TransactionStatus.Completed:
            variant = "success";
            text = "Completed";
            break;
        case TransactionStatus.Failed:
            variant = "destructive";
            text = "Failed";
            break;
        default:
            return "Unknown";
    }

    return <Badge variant={variant}>{text}</Badge>;
};



interface FetchRecentTransactionsProps {
    clientId: string;
    setTableData: (TableData: TransactionTableRow[]) => void;
    mode?: "bankAccount" | "recent" | "all";
    pageNumber?: number;
    pageSize?: number;
    fromDate?: Date;
    toDate?: Date;
    status?: TransactionStatus;
    bankAccountId?: string;
    setTotalPages?: (totalPages: number) => void;
    setError?: (error: string) => void;
}


// Treba uraditi proveru kada je fromAccount nas acc onda smo poslali pare, ako je toAccount nas account onda smo dobili pare
// Takodje ako su na oba from i to Account nas acc onda smo prebacili pare iz jednog racuna na drugi
export const fetchTransactionTableRows = async (
    {clientId, setTableData, mode="all", pageNumber=1, pageSize=10, fromDate, toDate, status, bankAccountId, setTotalPages, setError}: FetchRecentTransactionsProps ) => {

    // FETCH ACCOUNT NUMBERS
    if(bankAccountId)
        mode="bankAccount";

    let clientAccountNumbers = [];
    try{
        const response = await getAllAccountsClient(clientId, 1, 100)
        clientAccountNumbers = response.data.items.map((item: { accountNumber: string }) => item.accountNumber)
    }
    catch(error){
        showErrorToast({error, defaultMessage: "Error fetching client accounts"});
        return;
    }
    try {
        // FETCH TRANSACTIONS
        let transactionsData: TransactionResponse;
        if (mode == "recent"){
            transactionsData = await getNewTransactions();
        }
        else if(mode=="all" || !bankAccountId){
            transactionsData = await getAllTransactions(pageNumber, pageSize, fromDate, toDate, status);
        }
        else{
            transactionsData = await getAccountTransactions(bankAccountId, pageNumber, pageSize, fromDate, toDate, status);
        }

        console.log("TRANSACTIONS DATA", transactionsData);

        if (setTotalPages)
            setTotalPages(transactionsData.totalPages);


        let tableRows: Array<TransactionTableRow> = [];
        console.log("KLIJENT ACC", clientAccountNumbers);
        for(let item of transactionsData.items as Transaction[]) {
            /*
            - Deposit (uplata novca na racun) <=> fromAccount -> null & toAccount -> yourAccount (mora biti tvoj, ako nije onda je nesto lose)
            - Withdraw (skidanje novca sa racuna)  <=> fromAccount -> yourAccount (isto mora biti tvoj) & toAccount -> null
            - Uplata na neciji racun <=> fromAccount -> yourAccount (mora biti tvoj) & toAccount -> someonesAccount (mora biti neki drugi) -
            ovo moze biti i prenos sa svog jednog na svoj drugi racun
            - Neko uplacuje tebi na racun => fromAccount -> someonesAccount (mora biti neki drugi) & toAccount (mora biti tvoj) -
            ovo isto moze biti i za prenos sa svog jednog na svoj drugi racun
            - Menjacnica => fromAccount -> yourAccount (mora biti tvoj) & toAccount -> yourAccount (mora biti tvoj) -
            account-i moraju biti isti, jer je ovo cista menjacnica i nista vise, dok za one prethodne isto moze da se vrse uplate/isplate ali usput i da se izvrsi menjacnica
            */
            const fromAccount =  item.fromAccount ;
            const toAccount = item.toAccount ;

            // if(fromAccount){
            //     fromAccount.accountNumber = "222" + fromAccount.accountNumber + "11"
            // }
            // if(toAccount){
            //     toAccount.accountNumber = "333" + toAccount.accountNumber + "33"
            // }
            console.log("Checking Transaction:", {
                fromAccount: fromAccount?.accountNumber,
                toAccount: toAccount?.accountNumber,
                clientAccounts: clientAccountNumbers
            });


            let currencyCode = "RSD";
            // DEPOSIT
            if(fromAccount == null && toAccount != null && clientAccountNumbers.includes(toAccount.accountNumber)){
                // console.log("DEPOSIT");
                // console.log("FROM ACCOUNT", fromAccount);
                // console.log("TO ACCOUNT", toAccount);
                currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount.accountNumber}).then(acc => acc.data.items.currency.code)
                tableRows.push({
                    fromAccountNumber: null,
                    toAccountNumber: toAccount.accountNumber,
                    amount: item.toAmount,
                    currencyCode: currencyCode,
                    date: new Date(item.createdAt),
                    type: TransactionType.Deposit,
                    status: item.status,
                    purpose: item.purpose
                })
            }
            else if(fromAccount==null)
                continue;
            // WITHDRAW
            else if(clientAccountNumbers.includes(fromAccount.accountNumber) && toAccount === null){
                // console.log("WITHDRAW");
                // console.log("FROM ACCOUNT", fromAccount);
                // console.log("TO ACCOUNT", toAccount);
                currencyCode = await getAccountById(fromAccount.id).then(acc => acc.data.currency.code)
                tableRows.push({
                    fromAccountNumber: fromAccount.accountNumber,
                    toAccountNumber: null,
                    amount: -item.fromAmount,
                    currencyCode: currencyCode,
                    date: new Date(item.createdAt),
                    type: TransactionType.Withdraw,
                    status: item.status,
                    purpose: item.purpose
                })
            }
            else if(toAccount === null){
                continue;
            }
            // PAYMENT TO SOMEONE'S ACCOUNT
            else if(clientAccountNumbers.includes(fromAccount.accountNumber) && !clientAccountNumbers.includes(toAccount.accountNumber)){
                // console.log("Payments TO someone's account");
                // console.log("FROM ACCOUNT", fromAccount);
                // console.log("TO ACCOUNT", toAccount);
                currencyCode = await getAccountById(fromAccount.id).then(acc => acc.data.currency.code)
                tableRows.push({
                    fromAccountNumber: fromAccount.accountNumber,
                    toAccountNumber: toAccount.accountNumber,
                    amount: -item.fromAmount,
                    currencyCode: currencyCode,
                    date: new Date(item.createdAt),
                    type: TransactionType.Transaction,
                    status: item.status,
                    purpose: item.purpose
                })
            }
            // PAYMENT FROM SOMEONE
            else if(!(clientAccountNumbers.includes(fromAccount.accountNumber)) && clientAccountNumbers.includes(toAccount.accountNumber)){
                // console.log("Payments FROM someone's account");
                // console.log("FROM ACCOUNT", fromAccount);
                // console.log("TO ACCOUNT", toAccount);
                currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount.accountNumber}).then(acc => acc.data.items.currency.code)
                tableRows.push({
                    fromAccountNumber: fromAccount.accountNumber,
                    toAccountNumber: toAccount.accountNumber,
                    amount: item.toAmount,
                    currencyCode: currencyCode,
                    date: new Date(item.createdAt),
                    type: TransactionType.Transaction,
                    status: item.status,
                    purpose: item.purpose
                })
            }
            // EXCHANGE
            else if(clientAccountNumbers.includes(fromAccount.accountNumber) && fromAccount.accountNumber == toAccount.accountNumber){
                // console.log("EXCHANGE");
                // console.log("FROM ACCOUNT", fromAccount);
                // console.log("TO ACCOUNT", toAccount);
                currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount.accountNumber}).then(acc => acc.data.items.currency.code)
                tableRows.push({
                    fromAccountNumber: fromAccount.accountNumber,
                    toAccountNumber: toAccount.accountNumber,
                    amount: item.fromAmount,
                    currencyCode: currencyCode,
                    date: new Date(item.createdAt),
                    type: TransactionType.Exchange,
                    status: item.status,
                    purpose: item.purpose
                })
            }

        }
        console.log("Table rows", tableRows);
        setTableData([...tableRows]);
    } catch (error) {
        if(setError)
            setError("Failed to fetch transactions");
        showErrorToast({error, defaultMessage: "Error fetching transactions"});
    }
};