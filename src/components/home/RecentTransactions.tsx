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
import {Badge} from "@/components/ui/badge.tsx";


enum TransactionType {
    Withdraw = "Withdraw",
    Deposit = "Deposit",
    Transaction = "Transaction",
    Exchange = "Exchange"
}
interface TransactionTableRow {
    fromAccountNumber: string | null,
    toAccountNumber: string | null,
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

            for(let item of transactionsData.items as Transaction[]) {
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
                if(fromAccount == null && toAccount != null && clientAccountNumbers.includes(toAccount)){
                    console.log("Deposit usao")
                    currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount}).then(acc => acc.data.items.currency.code)
                    console.log("DEPOSIT", tableRows)
                    tableRows.push({
                        fromAccountNumber: null,
                        toAccountNumber: toAccount,
                        amount: item.toAmount,
                        currencyCode: currencyCode,
                        date: new Date(item.createdAt),
                        type: TransactionType.Deposit,
                        status: item.status
                    })
                }
                else if(fromAccount==null)
                    continue;
                // WITHDRAW
                else if(clientAccountNumbers.includes(fromAccount.accountNumber.toString()) && toAccount === null){
                    console.log("Withdraw usao")
                    currencyCode = await getAccountById(fromAccount.id).then(acc => acc.data.currency.code)
                    console.log("WITHDRAW", tableRows)
                    tableRows.push({
                        fromAccountNumber: fromAccount.accountNumber,
                        toAccountNumber: null,
                        amount: -item.fromAmount,
                        currencyCode: currencyCode,
                        date: new Date(item.createdAt),
                        type: TransactionType.Withdraw,
                        status: item.status
                    })
                }
                else if(toAccount === null){
                    continue;
                }
                // PAYMENT TO SOMEONE'S ACCOUNT
                else if(clientAccountNumbers.includes(fromAccount.accountNumber.toString()) && !clientAccountNumbers.includes(toAccount)){
                    console.log("Payment usao")
                    currencyCode = await getAccountById(fromAccount.id).then(acc => acc.data.currency.code)
                    console.log("PAYMENT", tableRows)
                    tableRows.push({
                        fromAccountNumber: fromAccount.accountNumber,
                        toAccountNumber: toAccount,
                        amount: -item.fromAmount,
                        currencyCode: currencyCode,
                        date: new Date(item.createdAt),
                        type: TransactionType.Transaction,
                        status: item.status
                    })
                }
                // PAYMENT FROM SOMEONE
                else if(!(clientAccountNumbers.includes(fromAccount.accountNumber.toString())) && clientAccountNumbers.includes(toAccount)){
                    console.log("Payment usao 2")
                    currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount}).then(acc => acc.data.items.currency.code)
                    console.log("FROM SM", tableRows)
                    tableRows.push({
                        fromAccountNumber: fromAccount.accountNumber,
                        toAccountNumber: toAccount,
                        amount: item.toAmount,
                        currencyCode: currencyCode,
                        date: new Date(item.createdAt),
                        type: TransactionType.Transaction,
                        status: item.status
                    })
                }
                // EXCHANGE
                else if(clientAccountNumbers.includes(fromAccount.accountNumber.toString()) && fromAccount.accountNumber == toAccount){
                    console.log("Ex usao")
                    currencyCode = await getAllAccountClientWithFilters(clientId, 1, 1 , {accountNumber: toAccount}).then(acc => acc.data.items.currency.code)
                    console.log("EX", tableRows)
                    tableRows.push({
                        fromAccountNumber: fromAccount.accountNumber,
                        toAccountNumber: toAccount,
                        amount: item.fromAmount,
                        currencyCode: currencyCode,
                        date: new Date(item.createdAt),
                        type: TransactionType.Exchange,
                        status: item.status
                    })
                }

            }
            setTableData([...tableRows]);
        } catch (error) {
            console.log(error);
            showErrorToast({error, defaultMessage: "Error fetching transactions"});
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const accounts = await fetchClientAccounts();

                await fetchRecentTransactions(accounts);

            } catch (error) {
                console.error("Error in sequential loading:", error);
            }
        }
        loadData();
    }, []);

    const getStatusLabel = (status: TransactionStatus) => {
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
                            <TableHead className="py-3 px-2">From account</TableHead>
                            <TableHead className="py-3 px-2">To account</TableHead>
                            <TableHead className="py-3 px-2">Date & Time</TableHead>
                            <TableHead className="py-3 px-2">Amount</TableHead>
                            <TableHead className="py-3 px-2">Type</TableHead>
                            <TableHead className="py-3 px-2">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tableData.map((item, index) => (
                            <TableRow
                                key={index}
                                className="text-sm font-medium border-border text-secondary-foreground text-center"
                            >
                                <TableCell className="px-2  py-5 ">
                                        {item.fromAccountNumber || "/"}
                                </TableCell>
                                <TableCell className="px-2  py-5 ">
                                    {item.toAccountNumber || "/"}
                                </TableCell>
                                <TableCell className="px-2  py-5">
                                    {new Date(item.date).toLocaleDateString('sr-RS')}({new Date(item.date).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })})
                                </TableCell>
                                <TableCell className={`font-semibold px-2 py-5 ${item.amount > 0 ? (item.type != TransactionType.Exchange ? "text-success" : ""): "text-destructive"}`}>
                                    {item.amount > 0 && item.type != TransactionType.Exchange ? "+" : ""}
                                    {formatCurrency(item.amount, item.currencyCode)}
                                </TableCell>
                                <TableCell className="px-2  py-5">
                                    {item.type}
                                </TableCell>
                                <TableCell className="px-2  py-5">
                                    {getStatusLabel(item.status)}
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