import {getGenderString, getRoleString, User} from "@/types/user.ts";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import UserDropdownMenu from "@/components/user-table/all-users/UserDropdownMenu.tsx";
import {PortfolioData} from "@/types/portfolio-data.ts";
import {formatCurrency} from "@/lib/format-currency.ts";

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-RS') + " (" + date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit'}) + ")"
};

export function generatePortfolioColumns(): ColumnDef<PortfolioData>[] {
    return [
        {
            accessorKey: "type",
            header: "Type",
            enableHiding: true,
        },
        {
            accessorKey: "ticker",
            header: "Ticker",
            enableHiding: true,
        },
        {
            accessorKey: "amount",
            header: "Amount",
            enableHiding: true,
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({row}) => {
                return (formatCurrency(row.original.price, row.original.currency.code))
            },
            enableHiding: true,
        },
        {
            accessorKey: "profit_loss",
            header: "Profit/Loss",
            cell: ({row}) => {
                return (formatCurrency(row.original.price, row.original.currency.code))
            },
            enableHiding: true,
        },
        {
            accessorKey: "lastModified",
            header: "Last Modified",
            cell: ({ row }) => {
                return (new Date(row.original.lastModified)).toLocaleString("sr-RS")
            },
            enableHiding: true,
        },
        {
            accessorKey: "public",
            header: "Public",
            enableHiding: true,
        },
    ];
}
