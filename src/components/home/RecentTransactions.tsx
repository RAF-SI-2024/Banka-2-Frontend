import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import {Transaction, TransactionResponse} from "@/types/transaction.ts";
import {getNewTransactions} from "@/api/bankAccount.ts";
import {formatCurrency} from "@/utils/format-currency.ts";



const RecentTransactionsCard = ({ className, ...props }: React.ComponentProps<"div">) => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchRecentTransactions = async () => {
        console.log("Fetching recent transactions")
        try {
            const transactionsData: TransactionResponse = await getNewTransactions();
            if (transactionsData.items.length === 0)
            setTransactions(transactionsData.items);
            console.log(transactionsData)
        } catch (err) {
            console.log(err);
        }
    };

    function generateMockData() {
        const mockData = [
            {
                id: 1,
                toAccount: { accountNumber: '123456789' },
                
                createdAt: '2024-03-05T10:30:00.000Z',
                toAmount: 1500.75,
                currencyTo: { code: 'USD' },
                status: 'Completed',

            },
            {
                id: 2,
                toAccount: { accountNumber: '987654321' },
                createdAt: '2024-03-06T12:00:00.000Z',
                toAmount: 250.5,
                currencyTo: { code: 'EUR' },
                status: 'Pending',

            },
            {
                id: 3,
                toAccount: { accountNumber: '456789123' },
                createdAt: '2024-03-07T14:45:00.000Z',
                toAmount: 1000,
                currencyTo: { code: 'GBP' },
                status: 'Failed',

            },
            {
                id: 4,
                toAccount: { accountNumber: '789123456' },
                createdAt: '2024-03-08T09:30:00.000Z',
                toAmount: 350,
                currencyTo: { code: 'EUR' },
                status: 'Completed',
            },
            {
                id: 5,
                toAccount: { accountNumber: '321654987' },
                createdAt: '2024-03-09T16:00:00.000Z',
                toAmount: 1500,
                currencyTo: { code: 'USD' },
                status: 'Pending',
            },
            // Dodajte još objekata po potrebi
        ];

        // @ts-expect-error Missing few datatypes, not important for mock data
        setTransactions(mockData)
    }

    useEffect(() => {
        fetchRecentTransactions()

        // Mock data until api works
        if (transactions.length === 0)
            generateMockData()
    }, []);

    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="pb-2">
                <CardTitle className="font-heading text-2xl">Recent transactions</CardTitle>
            </CardHeader>
            <Card className="m-4 rounded-md font-paragraph" >
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
                        {transactions.map((item) => (
                            <TableRow
                                key={item.id}
                                className="text-sm font-medium border-border text-secondary-foreground"
                            >
                                <TableCell className="px-6 py-5 ">
                                        {item.toAccount.accountNumber}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {format(new Date(item.createdAt), "dd MM, yyyy")}
                                </TableCell>

                                <TableCell className={`font-semibold px-6 py-5`}>
                                    {formatCurrency(item.toAmount, item.currencyTo.code)}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {item.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Card>
    )
}

export default RecentTransactionsCard;