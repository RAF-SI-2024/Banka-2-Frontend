import { ColumnDef } from "@tanstack/react-table"
import {TransactionTableRow, TransactionType} from "@/types/transaction.ts"
import { formatCurrency } from "@/lib/format-currency.ts";
import {getTransactionStatusBadge} from "@/lib/transactions-table-utils.tsx";


const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-RS') + " (" + date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit'}) + ")"
};

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
                return (<div className={`font-semibold px-2 py-5 ${row.original.amount > 0 ? (row.original.type != TransactionType.Exchange ? "text-success" : ""): "text-destructive"}`}>
                    {row.original.amount > 0 && row.original.type != TransactionType.Exchange ? "+" : ""}
                    {formatCurrency(row.original.amount, row.original.currencyCode)}</div>)
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
