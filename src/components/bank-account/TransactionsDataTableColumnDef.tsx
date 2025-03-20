import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/types/transaction.ts"
import { formatCurrency } from "@/utils/format-currency.ts";
import { TransactionStatus } from "@/types/enums.ts";


const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    console.log(date)
    return date.toLocaleString();
};

export function generateTransactionColumns(): ColumnDef<Transaction>[] {
    return [
        {
            accessorKey: "fromAccount",
            header: "From Account",
            enableHiding: false,
            cell: ({ row }) => {
                return row.original.fromAccount.accountNumber;
            }
        },
        {
            accessorKey: "toAccount",
            header: "To Account",
            enableHiding: false,
            cell: ({ row }) => {
                return row.original.fromAccount.accountNumber;
            }
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            enableHiding: true,
            cell: ({ row }) => {
                return formatDate(row.original.createdAt);
            }
        },
        {
            accessorKey: "purpose",
            header: "Purpose",
        },
        /*{
            accessorKey: "fromAmount",
            header: "From Amount",
            enableHiding: true,
            cell: ({ row }) => {
                return (
                    <span className={row.original.fromAmount < 0 ? "text-destructive" : "text-success"}>
                    {formatCurrency(row.original.fromAmount, row.original.currencyFrom.code)}
                    </span>
                );
            }
        },
        {
            accessorKey: "toAmount",
            header: "To Amount",
            enableHiding: true,
            cell: ({ row }) => {
                return (
                    <span className={row.original.fromAmount < 0 ? "text-destructive" : "text-success"}>
                    {formatCurrency(row.original.toAmount, row.original.currencyTo.code)}
                    </span>
                );
            }
        },*/
        {
            header: "Amount",
            enableHiding: true,
            cell: ({ row }) => {
                const amountDifference = row.original.fromAmount - row.original.toAmount;
                const currencyCode = row.original.currencyFrom.code;
                return (
                    <span className={amountDifference < 0 ? "text-destructive" : "text-success"}>
                        {formatCurrency(amountDifference, currencyCode)}
                    </span>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => TransactionStatus[row.original.status],
        },
    ];
}
