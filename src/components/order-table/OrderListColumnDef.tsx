import { Badge } from "@/components/ui/badge";
import {Order, Status, Direction} from "@/types/order";
import { formatCurrency } from "/src/lib/format-currency.ts";
import { formatNumber } from "/src/lib/format-number.ts";
import OrderDropdownMenu from "./OrderActionMenu.tsx";

export function generateOrderColumns() {
    return [
        {
            accessorKey: "email",
            header: "Email",
            enableHiding: true,
        },
        {
            accessorKey: "username",
            header: "Username",
            enableHiding: true,
        },
        {
            accessorKey: "orderType",
            header: "Order Type",
            enableHiding: true,
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
            cell: ({ row }) => formatNumber(row.original.quantity, true),
            enableHiding: true,
        },
        {
            accessorKey: "contractSize",
            header: "Contract Size",
            cell: ({ row }) => formatNumber(row.original.contractSize, true),
            enableHiding: true,
        },
        {
            accessorKey: "pricePerUnit",
            header: "Price per Unit",
            cell: ({ row }) => formatCurrency(row.original.pricePerUnit),
            enableHiding: true,
        },
        {
            accessorKey: "direction",
            header: "Direction",
            cell: ({ row }) => {
                const directionValue = row.original.direction;

                const variant = directionValue === "Buy" ? "success" : "destructive";
                return <Badge variant={variant}>{directionValue}</Badge>;
            },
            enableHiding: true,
        },
        {
            accessorKey: "remainingPortions",
            header: "Remaining Portions",
            cell: ({ row }) => formatNumber(row.original.remainingPortions, true),
            enableHiding: true,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const statusValue = String(row.original.status).toLowerCase();

                let statusVariant = "default";
                if (statusValue === "pending") statusVariant = "warning";
                else if (statusValue === "approved") statusVariant = "default";
                else if (statusValue === "declined") statusVariant = "destructive";
                else if (statusValue === "done") statusVariant = "success";

                let statusText = statusValue.charAt(0).toUpperCase() + statusValue.slice(1,statusValue.length);
                return <Badge variant={statusVariant}>{statusText}</Badge>;
            },
            enableHiding: true,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) =>
                row.original.status === "pending" ? (
                    <OrderDropdownMenu
                        onEdit={() => console.log("Edit order", row.original)}
                        onDelete={() => console.log("Delete order", row.original)}
                    />
                ) : null,
            enableHiding: false,
        },
    ];
}

