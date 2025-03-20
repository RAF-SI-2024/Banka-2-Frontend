import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import React, {useEffect, useState} from "react";
import {Transaction, TransactionResponse} from "@/types/transaction.ts";
import {
    getAllAccountClientWithFilters,
    getAllAccounts,
    getAllAccountsClient,
    getNewTransactions
} from "@/api/bankAccount.ts";
import {formatCurrency} from "@/utils/format-currency.ts";

const RecentTransactionsCard = ({ className, ...props }: React.ComponentProps<"div">) => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currenciesForAccount, setCurrenciesForAccount] = useState<string[]>([]);
    //TODO: Treba uraditi proveru kada je fromAccount nas acc onda smo poslali pare, ako je toAccount nas account onda smo dobili pare
    // TODO: Takodje ako su na oba from i to Account nas acc onda smo prebacili pare iz jednog racuna na drugi
    const fetchRecentTransactions = async () => {
        try {
            const transactionsData: TransactionResponse = await getNewTransactions();
            setTransactions(transactionsData.items);
            return transactionsData.items;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const fetchCurrencies = async (response: string[]) => {
        const clientId: string = JSON.parse(sessionStorage.user).id;
        try{
            for(let i = 0; i < response.length; i++){
                const account = await getAllAccountClientWithFilters(
                    clientId,
                    1,  // page
                    1,  // size
                    { accountNumber: response.items[i].fromAccount.accountNumber }  // filters
                );
                setCurrenciesForAccount(prev => [...prev, account.items[0].currency.code]);
            }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchRecentTransactions();
            await fetchCurrencies(response);
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
                        {transactions.map((item, index) => (
                            <TableRow
                                key={item.id}
                                className="text-sm font-medium border-border text-secondary-foreground"
                            >
                                <TableCell className="px-6 py-5 ">
                                        {item.fromAccount.accountNumber.toString()}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {(new Date(item.createdAt).toLocaleDateString('sr-RS'))}
                                </TableCell>
                                <TableCell className={`font-semibold px-6 py-5 ${item.fromAmount < item.toAmount ? "text-success" : "text-destructive"}`}>
                                    {item.fromAmount < item.toAmount ? "+" : ""}
                                    {formatCurrency(Number(item.toAmount) - Number(item.fromAmount), index < currenciesForAccount.length ? currenciesForAccount[index] : "RSD")}
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