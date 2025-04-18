import {getGenderString, getRoleString, User} from "@/types/bank_user/user.ts";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import UserDropdownMenu from "@/components/user-table/all-users/UserDropdownMenu.tsx";
import {PortfolioData} from "@/types/exchange/portfolio-data.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Button} from "@/components/ui/button.tsx";

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-RS') + " (" + date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit'}) + ")"
};

export function generatePortfolioColumns(setOpen: (open: boolean) => void, setSelectedRow: (row: PortfolioData) => void): ColumnDef<PortfolioData>[] {    return [
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
        {
            id: "change",
            header: "Change public",
            cell: ({ row }) => (
                <Button variant="gradient" onClick={() => {
                    setSelectedRow(row.original);
                    setOpen(true);
                }}>
                    Change
                </Button>
            ),
        },
        {
            id: "sell",
            header: "Sell asset",
            cell: ({ row }) => (
                <Button
                    variant="gradient"
                    onClick={() => handleSell(row.original)}
                >
                    Sell
                </Button>
            ),
        },

    ];
}
const handleSell = (item: PortfolioData) => {

    console.log(`Prodaja hartije: ${item.price}`);
};
