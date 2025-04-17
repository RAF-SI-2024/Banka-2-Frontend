import { Badge } from "@/components/ui/badge";
import {Order, Status, Direction} from "@/types/exchange/order.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import { formatNumber } from "@/lib/format-number.ts";
import { ColumnDef } from "@tanstack/react-table";
import OrderDropdownMenu from "./OrderDropdownMenu";

export function generateOrderColumns(handleApprove: (order: Order) => void, handleDecline: (order: Order) => void): ColumnDef<Order>[] {
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
            accessorKey: "securityType",
            header: "Trading Type",
            enableHiding: true,
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
            cell: ({ row }) => formatNumber(row.original.quantity),
            enableHiding: true,
        },
        {
            accessorKey: "contractSize",
            header: "Contract Size",
            cell: ({ row }) => formatNumber(row.original.contractSize),
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
                let variant: "success" | "destructive" | "warning" | "outline" | null | undefined;
                let text;
        
                switch (row.original.direction) {
                    case Direction.Buy:
                        variant = "success";
                        text = "Buy";
                        break;
                    case Direction.Sell:
                        variant = "destructive";
                        text = "Sell";
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
            accessorKey: "remainingPortions",
            header: "Remaining Portions",
            cell: ({ row }) => formatNumber(row.original.remainingPortions),
            enableHiding: true,
        },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    let variant: "success" | "destructive" | "warning" | "outline" | "default" | null | undefined;
                    let text;

                    switch (row.original.status) {
                        case Status.Pending:
                            variant = "warning";
                            text = "Pending";
                            break;
                        case Status.Approved:
                            variant = "default";
                            text = "Approved";
                            break;
                        case Status.Declined:
                            variant = "destructive";
                            text = "Declined";
                            break;
                        case Status.Done:
                            variant = "success";
                            text = "Done";
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
            cell: ({ row }) =>
                row.original.status === 0 ? (
                    <OrderDropdownMenu
                        onApprove={() => handleApprove(row.original)}
                        onDecline={() => handleDecline(row.original)}
                    />
                ) : null,
            enableHiding: false,
        },
    ];
}

