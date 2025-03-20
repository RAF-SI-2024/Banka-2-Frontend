import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import React, {useEffect, useState} from "react";
import {Transaction, TransactionResponse} from "@/types/transaction.ts";
import {
    getAccountById,
    getAllAccountClientWithFilters,
    getAllAccountsClient,
    getNewTransactions
} from "@/api/bankAccount.ts";
import {formatCurrency} from "@/utils/format-currency.ts";
import {showErrorToast} from "@/utils/show-toast-utils.tsx";
import {TransactionStatus} from "@/types/enums.ts";


enum TransactionType {
    Withdraw = "Withdraw",
    Deposit = "Deposit",
    Transaction = "Transaction",
    Exchange = "Exchange"
}
interface TransactionTableRow {
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
    currencyCode: string,
    date: Date
    type: TransactionType,
    status: TransactionStatus,
}

const RecentTransactionsCard = ({ className, ...props }: React.ComponentProps<"div">) => {

    const clientId: string = JSON.parse(sessionStorage.user).id;

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [tableData, setTableData] = useState<TransactionTableRow[]>([]);

    const fetchClientAccounts = async () => {
        try{
            const response = await getAllAccountsClient(clientId, 1, 100)
            return response.data.items.map((item: { accountNumber: string }) => item.accountNumber)
        } catch (error) {
            showErrorToast({error, defaultMessage: "Error fetching client accounts"});
            return [];
        }
    }


    //TODO: Treba uraditi proveru kada je fromAccount nas acc onda smo poslali pare, ako je toAccount nas account onda smo dobili pare
    // TODO: Takodje ako su na oba from i to Account nas acc onda smo prebacili pare iz jednog racuna na drugi
    const fetchRecentTransactions = async (clientAccountNumbers: string[]) => {
        try {
            const transactionsData: TransactionResponse = await getNewTransactions();
            setTransactions(transactionsData.items);
            console.log("TRANSAKCIJE", transactionsData.items);
            let tableRows: Array<TransactionTableRow> = [];

            for(let item of transactionsData.items as Transaction) {
                /*
                - Deposit (uplata novca na racun) <=> fromAccount -> null & toAccount -> yourAccount (mora biti tvoj, ako nije onda je nesto lose)
                - Withdraw (skidanje novca sa racuna)  <=> fromAccount -> yourAccount (isto mora biti tvoj) & toAccount -> null
                - Uplata na neciji racun <=> fromAccount -> yourAccount (mora biti tvoj) & toAccount -> someonesAccount (mora biti neki drugi) -
                ovo moze biti i prenos sa svog jednog na svoj drugi racun
                - Neko uplacuje tebi na racun => fromAccount -> someonesAccount (mora biti neki drugi) & toAccount (mora biti tvoj) -
                ovo isto moze biti i za prenos sa svog jednog na svoj drugi racun
                - Menjacnica => fromAccount -> yourAccount (mora biti tvoj) & toAccount -> yourAccount (mora biti tvoj) -
                account-i moraju biti isti, jer je ovo cista menjacnica i nista vise, dok za one prethodne isto moze da se vrse uplate/isplate ali usput i da se izvrsi menjacnica*/
                console.log("ITEM", item);
                const fromAccount = item.fromAccount;
                const toAccount = item.toAccount;
                console.log("FROM:", fromAccount);
                console.log("TO", toAccount);
                let currencyCode = "RSD";
                console.log("TRANS")
                // DEPOSIT
                console.log("client accounts", clientAccountNumbers)
                if(fromAccount == null && clientAccountNumbers.includes(toAccount.accountNumber)){
                    console.log("Deposit usao")
                    currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount}).then(acc => acc.data.items.currency.code)
                    console.log("DEPOSIT", tableRows)
                    tableRows.push({
                        fromAccount: null,
                        toAccount: toAccount,
                        amount: item.toAmount,
                        currencyCode: currencyCode,
                        date: item.createdAt,
                        type: TransactionType.Deposit,
                        status: item.status
                    })
                }
                // WITHDRAW
                else if(clientAccountNumbers.includes(fromAccount.accountNumber) && toAccount === null){
                    console.log("Withdraw usao")
                    currencyCode = await getAccountById(item.fromAccount.id).then(acc => acc.data.currency.code)
                    console.log("WITHDRAW", tableRows)
                    tableRows.push({
                        fromAccount: fromAccount.accountNumber,
                        toAccount: null,
                        amount: -item.fromAmount,
                        currencyCode: currencyCode,
                        date: item.createdAt,
                        type: TransactionType.Withdraw,
                        status: item.status
                    })
                }
                else if(toAccount === null){
                    continue;
                }
                // PAYMENT TO SOMEONE'S ACCOUNT
                else if(clientAccountNumbers.includes(fromAccount.accountNumber) && !clientAccountNumbers.includes(toAccount.accountNumber)){
                    console.log("Payment usao")
                    currencyCode = await getAccountById(item.fromAccount.id).then(acc => acc.data.currency.code)
                    console.log("PAYMENT", tableRows)
                    tableRows.push({
                        fromAccount: fromAccount.accountNumber,
                        toAccount: toAccount,
                        amount: -item.fromAmount,
                        currencyCode: currencyCode,
                        date: item.createdAt,
                        type: TransactionType.Transaction,
                        status: item.status
                    })
                }
                // PAYMENT FROM SOMEONE
                else if(!(clientAccountNumbers.includes(fromAccount.accountNumber)) && clientAccountNumbers.includes(toAccount.accountNumber)){
                    console.log("Payment usao 2")
                    currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount}).then(acc => acc.data.items.currency.code)
                    console.log("FROM SM", tableRows)
                    tableRows.push({
                        fromAccount: fromAccount.accountNumber,
                        toAccount: toAccount,
                        amount: item.toAmount,
                        currencyCode: currencyCode,
                        date: item.createdAt,
                        type: TransactionType.Transaction,
                        status: item.status
                    })
                }
                // EXCHANGE
                else if(clientAccountNumbers.includes(fromAccount.accountNumber) && fromAccount.accountNumber == toAccount.accountNumber){
                    console.log("Ex usao")
                    currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount}).then(acc => acc.data.items.currency.code)
                    console.log("EX", tableRows)
                    tableRows.push({
                        fromAccount: fromAccount.accountNumber,
                        toAccount: toAccount,
                        amount: item.fromAmount,
                        currencyCode: currencyCode,
                        date: item.createdAt,
                        type: TransactionType.Exchange,
                        status: item.status
                    })
                }

            }
            setTableData([...tableRows]);
            return transactionsData.items;
        } catch (error) {
            console.log(error);
            showErrorToast({error, defaultMessage: "Error fetching transactions"});
            return null;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const accounts = await fetchClientAccounts();

                const response = await fetchRecentTransactions(accounts);

                if (response && response.length > 0) {
                    await fetchCurrencies(response);
                }
            } catch (error) {
                console.error("Error in sequential loading:", error);
            }
        }
        loadData();
    }, []);

    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl">Recent transactions</CardTitle>
            </CardHeader>
            <Card className="m-4 rounded-md font-paragraph" >
                {(!transactions || transactions.length === 0) ? (
                    <CardDescription>No recent transactions. Try making your first transaction today with BankToo!</CardDescription>
                ) : (
                <Table>
                    <TableHeader className="border-b-3">
                        <TableRow className="text-sm font-medium text-secondary-foreground">
                            <TableHead className="py-3 px-6">Recipient</TableHead>
                            <TableHead className="py-3 px-6">Date</TableHead>
                            <TableHead className="py-3 px-6">Amount</TableHead>
                            <TableHead className="py-3 px-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tableData.map((item) => (
                            <TableRow
                                key={item.id}
                                className="text-sm font-medium border-border text-secondary-foreground"
                            >
                                <TableCell className="px-6 py-5 ">
                                        {item.fromAccount}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {(new Date(item.date).toLocaleDateString('sr-RS'))}
                                </TableCell>
                                <TableCell className={`font-semibold px-6 py-5 ${item.amount > 0 ? (item.type != TransactionType.Exchange ? "text-success" : ""): "text-destructive"}`}>
                                    {item.amount > 0 && item.type != TransactionType.Exchange ? "+" : ""}
                                    {formatCurrency(item.amount, item.currencyCode)}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {item.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </Card>
        </Card>
    )
}

export default RecentTransactionsCard;