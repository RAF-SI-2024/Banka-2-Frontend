import { ColumnDef } from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge.tsx";
import {Loan, LoanStatus} from "@/types/loan";
import LoanOverviewDropdownMenu from "./LoanOverviewDropdownMenu";
import {formatCurrency} from "@/lib/format-currency.ts";


export function generateLoanOverviewColumns(handleDetail: (loan: Loan) => void):ColumnDef<Loan>[] {
    return(
        [
            {
                accessorKey: "id",
                header: "Loan number",
                enableHiding: true,

            },
            {
                accessorKey: "creationDate",
                header: "Creation date",
                cell: ({row}) => new Date(row.original.creationDate).toLocaleDateString("sr-RS"),
                enableHiding: true
            },
            {
                accessorKey: "type",
                cell: ({row}) => row.original.type.name || "N/A",
                header: "Type of loan",
                enableHiding: true,
            },
            {
                accessorKey: "amount",
                header: "Amount",
                cell: ({row}) => formatCurrency(row.original.amount, row.original.currency.code),
                enableHiding: true,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    let variant: "success" | "destructive" | "warning" | "outline" | null | undefined;
                    let text;

                    switch (row.original.status) {
                        case LoanStatus.Pending:
                            variant = "warning";
                            text = "Pending";
                            break;
                        case LoanStatus.Active:
                            variant = "success";
                            text = "Active";
                            break;
                        case LoanStatus.Rejected:
                            variant = "destructive";
                            text = "Rejected";
                            break;
                        case LoanStatus.Closed:
                            variant = "outline";
                            text = "Closed";
                            break;
                        default:
                            variant = "outline";
                            text = "Unknown";
                            break;
                    }

                    return <Badge variant={variant}>{text}</Badge>;
                },
                enableHiding: true,
            },

            {
                accessorKey: "actions",
                header: "Actions",
                cell: ({row}) => (
                    row.original.status == LoanStatus.Active &&
                    <LoanOverviewDropdownMenu
                        onDetail={() => handleDetail(row.original)}
                    />
                ),
                enableHiding: true,
            },

        ]);
}