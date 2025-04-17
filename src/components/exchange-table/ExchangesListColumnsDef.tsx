import { ColumnDef } from "@tanstack/react-table"
import { ExchangeTableData } from "@/types/exchange/exchange.ts";

export function generateExchangesColumns(): ColumnDef<ExchangeTableData>[] {
    return (
        [
            {
                accessorKey: "name",
                header: "Exchange Name",
                enableHiding: true,

            },
            {
                accessorKey: "acronym",
                header: "Acronym",
                enableHiding: true,
            },
            {
                accessorKey: "mic",
                header: "Mic Code",
                enableHiding: true,
            },
            {
                accessorKey: "polity",
                header: "Polity",
                enableHiding: true,
            },
            {
                accessorKey: "currency",
                header: "Currency",
                enableHiding: true,
                cell: ({row}) => row.original.currency.name,
            },
            {
                accessorKey: "timeZone",
                header: "Time Zone",
                enableHiding: true,
                cell: ({row}) => (row.original.timeZone[0] == "-" ? "" : "+") +
                    row.original.timeZone.substring(0, row.original.timeZone.lastIndexOf(":"))
            },
            {
                accessorKey: "openTime",
                header: "Open Time",
                enableHiding: true,
            },
            {
                accessorKey: "closeTime",
                header: "Close Time",
                enableHiding: true,
            },

        ]);
}