import { ColumnDef } from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge.tsx";
import {getInterestType, Loan, LoanStatus} from "@/types/bank_user/loan.ts";
import LoanDropdownMenu from "./LoanDropdownMenu";
import {formatCurrency} from "@/lib/format-currency.ts";


export function generateLoanColumns(handleApprove: (loan: Loan) => void, handleReject: (loan: Loan) => void):ColumnDef<Loan>[] {
    return(
        [
            {
                accessorKey: "id",
                header: "Loan number",
                enableHiding: true,

            },
            {
                accessorKey: "client",
                cell: ({row}) => row.original.account.client.firstName + " " + row.original.account.client.lastName,
                header: "Client",
                enableHiding: true,
            },
            {
                accessorKey: "accountNumber",
                cell: ({row}) => row.original.account.accountNumber || "N/A",
                header: "Account Number",
                enableHiding: true,
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
                accessorKey: "remainingAmount",
                header: "Amount to be paid",
                cell: ({row}) => formatCurrency(row.original.remainingAmount, row.original.currency.code),
                enableHiding: true,
            },
            {
                accessorKey: "period",
                header: "Number of installments",
                enableHiding: true,
            },
            {
                accessorKey: "creationDate",
                header: "Creation Date",
                cell: ({row}) => new Date(row.original.creationDate).toLocaleDateString("sr-RS"),
                enableHiding: true,
            },
            {
                accessorKey: "maturityDate",
                header: "Maturity Date",
                cell: ({row}) => new Date(row.original.maturityDate).toLocaleDateString("sr-RS"),
                enableHiding: true,
            },
            {
                accessorKey: "interestType",
                cell : ({row}) => getInterestType(row.original.interestType),
                header: "Interest Type",
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
                id: "actions",
                header: "Actions",
                cell: ({row}) => (
                    <LoanDropdownMenu
                        onApprove={() => handleApprove(row.original)}
                        onReject={() => handleReject(row.original)}
                    />
                ),
                enableHiding: false,
            },

        ]);
}