import { ColumnDef } from "@tanstack/react-table"
import { ExchangeTableData } from "@/types/exchange";

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
                accessorKey: "micCode",
                header: "Mic Code",
                enableHiding: true,
            },
            {
                accessorKey: "country",
                header: "Country",
                enableHiding: true,
            },
            {
                accessorKey: "currency",
                header: "Currency",
                enableHiding: true,
            },
            {
                accessorKey: "timeZone",
                header: "Time Zone",
                enableHiding: true,
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