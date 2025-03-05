import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Currency} from "@/components/home/ConverterCard.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {format} from "date-fns";


interface Transaction {
    id: string,
    recipient: string;
    value: number;
    createdAt: Date,
    currency: Currency
}

const transactions: Transaction[]  = [
    {
        id: "1",
        recipient: "McDonald's",
        value: -10.25,
        createdAt: new Date("2025-02-22T13:15:12.0000000+00:00"),
        currency: {
            name: "USD",
            symbol: "$",
            isAfter: false,
        }
    },
    {
        id: "2",
        recipient: "Boris Radovic",
        value: +4000,
        createdAt: new Date("2025-01-28T13:15:12.0000000+00:00"),
        currency: {
            name: "RSD",
            symbol: "RSD",
            isAfter: true,
        }
    },
    {
        id: "3",
        recipient: "Maxi DOO",
        value: -999.99,
        createdAt: new Date("2025-01-22T13:15:12.0000000+00:00"),
        currency: {
            name: "RSD",
            symbol: "RSD",
            isAfter: true,
        }
    },
    {
        id: "4",
        recipient: "Maxi DOO",
        value: -999.99,
        createdAt: new Date("2025-01-22T13:15:12.0000000+00:00"),
        currency: {
            name: "RSD",
            symbol: "RSD",
            isAfter: true,
        }
    },
    {
        id: "5",
        recipient: "Maxi DOO",
        value: -999.99,
        createdAt: new Date("2025-01-22T13:15:12.0000000+00:00"),
        currency: {
            name: "RSD",
            symbol: "RSD",
            isAfter: true,
        }
    },
]


const RecentTransactionsCard = ({ className, ...props }: React.ComponentProps<"div">) => {
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
                            <TableHead className="py-3 px-6">Time</TableHead>
                            <TableHead className="py-3 px-6">Amount</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {transactions.map((item) => (
                            <TableRow
                                key={item.id}
                                className="text-sm font-medium border-border text-secondary-foreground"
                            >
                                <TableCell className="px-6 py-5 ">
                                        {item.recipient}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {format(new Date(item.createdAt), "dd MMM, yyyy")}
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    {format(new Date(item.createdAt), "hh:mm a")}
                                </TableCell>
                                <TableCell className={`font-semibold px-6 py-5 ${item.value < 0 ? 'text-destructive' : 'text-success'}`}>
                                    {item.value < 0
                                        ? (!item.currency.isAfter
                                            ? `-${item.currency.symbol}${Math.abs(item.value)}`
                                            : `-${Math.abs(item.value)} ${item.currency.symbol}`)
                                        : (!item.currency.isAfter
                                            ? `+${item.currency.symbol}${Math.abs(item.value)}`
                                            : `+${Math.abs(item.value)} ${item.currency.symbol}`)
                                    }
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