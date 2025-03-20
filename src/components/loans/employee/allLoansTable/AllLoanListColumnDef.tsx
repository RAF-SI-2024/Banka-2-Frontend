import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/types/user.ts";
import {Badge} from "@/components/ui/badge.tsx";
import UserDropdownMenu from "@/components/usertable/UserDropdownMenu.tsx";
import {getGenderString, getInterestRate, getRoleString, LoanStatus} from "@/types/enums.ts";
import { Loan } from "@/types/loan";

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.



export function generateAllLoanColumns():ColumnDef<Loan>[] {
    return(
        [
            {
                accessorKey: "type",
                cell: ({row}) => row.original.type.name || "N/A",
                header: "Type of loan",
                enableHiding: true,
            },
            {
                accessorKey: "accountNumber",
                cell: ({row}) => row.original.account.accountNumber || "N/A",
                header: "Account Number",
                enableHiding: true,
            },
            {
                accessorKey: "amount",
                header: "Amount",
                enableHiding: true,
            },
            {
                accessorKey: "period",
                header: "Period",
                enableHiding: true,
            },
            {
                accessorKey: "creationDate",
                header: "Creation Date",
                enableHiding: true,
            },
            {
                accessorKey: "currency",
                cell: ({row}) => row.original.currency.code || "N/A",
                header: "Currency",
                enableHiding: true,
            },
            {
                accessorKey: "interestType",
                cell : ({row}) => getInterestRate(row.original.interestType),
                header: "Interest Type",
                enableHiding: true,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    let variant: "success" | "default" | "destructive" | "secondary" | "outline" | null | undefined;
                    let text;

                    switch (row.original.status) {
                        case LoanStatus.Active:
                            variant = "success";
                            text = "Active";
                            break;
                        case LoanStatus.Pending:
                            variant = "default";
                            text = "Pending";
                            break;
                        case LoanStatus.Rejected:
                            variant = "destructive";
                            text = "Rejected";
                            break;
                        default:
                            variant = "default";
                            text = "Unknown";
                            break;
                    }

                    return <Badge variant={variant}>{text}</Badge>;
                },
                enableHiding: true,
            },

            // TODO: PREOSTALO DUGOVANJE KREDITA -> BACKEND
        ]);
}