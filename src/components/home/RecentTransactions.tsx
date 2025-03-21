import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import React, {useEffect, useState} from "react";
import { TransactionTableRow} from "@/types/transaction.ts";
import {formatCurrency} from "@/utils/format-currency.ts";
import { TransactionType} from "@/types/enums.ts";
import {fetchTransactionTableRows, getTransactionStatusBadge} from "@/utils/transactions-table-utils.tsx";




const RecentTransactionsCard = ({ className, ...props }: React.ComponentProps<"div">) => {

    const clientId: string = JSON.parse(sessionStorage.user).id;

    const [tableData, setTableData] = useState<TransactionTableRow[]>([]);





    useEffect(() => {
        fetchTransactionTableRows({clientId: clientId, setTableData: setTableData, mode:"recent"});
    }, []);



    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl">Recent transactions</CardTitle>
            </CardHeader>
            <Card className="m-4 rounded-md font-paragraph" >
                {(!tableData || tableData.length === 0) ? (
                    <CardDescription>No recent transactions. Try making your first transaction today with BankToo!</CardDescription>
                ) : (
                <Table>
                    <TableHeader className="border-b-3">
                        <TableRow className="text-sm font-medium text-secondary-foreground">
                            <TableHead className="py-3 px-2">From account</TableHead>
                            <TableHead className="py-3 px-2">To account</TableHead>
                            <TableHead className="py-3 px-2">Date & time</TableHead>
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
                                    {getTransactionStatusBadge(item.status)}
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