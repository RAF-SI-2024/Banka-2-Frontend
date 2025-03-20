import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/types/transaction.ts"
import {formatCurrency} from "@/utils/format-currency.ts";
import {Currency} from "@/types/currency.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {InstallmentStatus} from "@/types/enums.ts";
import {Installment} from "@/types/loan.ts";

// Utility function to format date and time
const formatDate = (date: Date) => {
    if (!date) return "—";
    return date.toLocaleDateString('sr-RS'); // Example: 05/03/2025
};

export function generateInstallmentColumns(): ColumnDef<Installment>[] {
    return [
        {
            accessorKey: "amount",
            header: "Amount",
            enableHiding: false,
            cell: ({row} )=> {
                return formatCurrency(row.original.loan.amount / row.original.loan.period, row.original.loan.currency.code);
            }
        },
        {
            accessorKey: "expectedDueDate",
            header: "Expected due date",
            enableHiding: true,
            cell: ({ row }) => {
                const date = new Date(row.original.expectedDueDate);
                return formatDate(date);
            }
        },
        {
            accessorKey: "actualDueDate",
            header: "Actual due date",
            enableHiding: true,
            cell: ({ row }) => {
                const date = new Date(row.original.actualDueDate);
                return formatDate(date);
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            enableHiding: true,
            cell: ({ row }) => {
                const status = row.original.status as InstallmentStatus;

                const statusMap: Record<InstallmentStatus, { label: string; variant: "outline" | "success" | "warning" | "destructive" }> = {
                    [InstallmentStatus.Pending]: { label: "Pending", variant: "warning" },
                    [InstallmentStatus.Paid]: { label: "Paid", variant: "success" },
                    [InstallmentStatus.Overdue]: { label: "Overdue", variant: "destructive" },
                    [InstallmentStatus.Cancelled]: { label: "Cancelled", variant: "outline" }
                };

                return (
                    <Badge variant={statusMap[status]?.variant || "default"}>
                        {statusMap[status]?.label || "Unknown"}
                    </Badge>
                );
            }
        },
    ];
}
