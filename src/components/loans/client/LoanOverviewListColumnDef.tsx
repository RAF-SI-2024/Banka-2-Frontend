import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/types/user.ts";
import {Badge} from "@/components/ui/badge.tsx";
import UserDropdownMenu from "@/components/usertable/UserDropdownMenu.tsx";
import {getGenderString, getInterestRate, getRoleString} from "@/types/enums.ts";
import { Loan } from "@/types/loan";
import LoanOverviewDropdownMenu from "./LoanOverviewDropdownMenu";

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.



export function generateLoanOverviewColumns(handleDetail: (loan: Loan) => void):ColumnDef<Loan>[] {
    return(
        [
            {
                accessorKey: "id",
                cell: ({row}) => row.original.id || "N/A",
                header: "ID kredita",
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
                enableHiding: true,
            },
            {
                accessorKey: "actions",
                header: "Actions",
                cell: ({row}) => (
                    <LoanOverviewDropdownMenu
                        onDetail={() => handleDetail(row.original)}
                    />
                ),
                enableHiding: true,
            },

        ]);
}