import { ColumnDef } from "@tanstack/react-table"
import {TransactionStatus, TransactionTableRow, TransactionType} from "@/types/bank_user/transaction.ts"
import { formatCurrency } from "@/lib/format-currency.ts";
import {getTransactionStatusBadge} from "@/lib/transactions-table-utils.tsx";
import { formatDate } from "@/lib/format-date";
import {cn} from "@/lib/utils.ts";


export function generateTransactionColumns(): ColumnDef<TransactionTableRow>[] {
    return [
        {
            accessorKey: "fromAccount",
            header: "From Account",
            enableHiding: false,
            cell: ({ row }) => {
                return row.original.fromAccountNumber || "/";
            }
        },
        {
            accessorKey: "toAccount",
            header: "To Account",
            enableHiding: false,
            cell: ({ row }) => {
                return row.original.toAccountNumber || "/";
            }
        },
        {
            accessorKey: "date",
            header: "Date & time",
            enableHiding: true,
            cell: ({ row }) => {
                return formatDate(row.original.date);
            }
        },
        {
            accessorKey: "purpose",
            header: "Purpose",
            enableHiding: true,
        },
        {
            header: "Amount",
            enableHiding: true,
            cell: ({ row }) => {
                return (<div className={cn(`font-semibold px-2 py-5 ${row.original.sign === "+" ? "text-success" : (row.original.sign === "-" ? "text-destructive" : "text-foreground")}`, [TransactionStatus.Failed, TransactionStatus.Canceled, TransactionStatus.Invalid].includes(row.original.status) ? "text-muted-foreground" : "")}>
                    {row.original.sign}
                    {formatCurrency(row.original.amount, row.original.currencyCode)}
                </div>)
            }
        },
        {
            accessorKey: "type",
            header: "Type",
            enableHiding: true
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getTransactionStatusBadge(row.original.status),
        },
    ];
}
