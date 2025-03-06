import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/types/transaction.ts"
import {formatCurrency} from "@/utils/format-currency.ts";
import {Currency} from "@/types/currency.ts";

// Utility function to format date and time
const formatDate = (date: Date) => {
    return date.toLocaleDateString('sr-RS'); // Example: 05/03/2025
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }); // Example: 14:35
};

export function generateTransactionColumns(currency: Currency): ColumnDef<Transaction>[] {
    return [
        {
            accessorKey: "name",
            header: "Transaction",
            enableHiding: false,
        },
        {
            accessorKey: "date",
            header: "Date",
            enableHiding: true,
            cell: ({ row }) => {
                const date = new Date(row.original.date);
                return formatDate(date);
            }
        },
        {
            accessorKey: "time",
            header: "Time",
            enableHiding: true,
            cell: ({ row }) => {
                const date = new Date(row.original.date);
                return formatTime(date);
            }
        },
        {
            accessorKey: "amount",
            header: "Amount",
            enableHiding: true,
            cell: ({ row }) => {
                return (
                    <span className={row.original.amount < 0 ? "text-destructive" : "text-success"}>
                    {formatCurrency(row.original.amount, currency.code)}
                    </span>
                );
            }
        },
    ];
}
