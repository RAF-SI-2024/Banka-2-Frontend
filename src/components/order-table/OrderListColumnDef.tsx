import {Badge} from "@/components/ui/badge";
import {Direction, Order, OrderStatus, orderTypeToString} from "@/types/exchange/order.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import {formatNumber} from "@/lib/format-number.ts";
import {ColumnDef} from "@tanstack/react-table";
import OrderDropdownMenu from "./OrderDropdownMenu";

export function generateOrderColumns(handleApprove: (order: Order) => void, handleDecline: (order: Order) => void): ColumnDef<Order>[] {
    return [
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.actuary.email,
            enableHiding: true,
        },
        {
            accessorKey: "username",
            header: "Username",
            cell: ({ row }) => row.original.actuary.username,
            enableHiding: true,
        },
        {
            accessorKey: "orderType",
            header: "Order Type",
            cell: ({ row }) => orderTypeToString(row.original.orderType),
            enableHiding: true,
        },
        // {
        //     accessorKey: "securityType",
        //     header: "Trading Type",
        //     enableHiding: true,
        // },
        {
            accessorKey: "quantity",
            header: "Quantity",
            cell: ({ row }) => formatNumber(row.original.quantity),
            enableHiding: true,
        },
        {
            accessorKey: "contractCount",
            header: "Contract Count",
            cell: ({ row }) => formatNumber(row.original.contractCount),
            enableHiding: true,
        },
        {
            accessorKey: "stopPrice",
            header: "Stop Price",
            cell: ({ row }) => formatCurrency(row.original.stopPrice, row.original.account.currency.code),
            enableHiding: true,
        },
        {
            accessorKey: "limitPrice",
            header: "Limit Price",
            cell: ({ row }) => formatCurrency(row.original.limitPrice, row.original.account.currency.code),
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
        // {
        //     accessorKey: "remainingPortions",
        //     header: "Remaining Portions",
        //     cell: ({ row }) => formatNumber(row.original.remainingPortions),
        //     enableHiding: true,
        // },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    let variant: "success" | "destructive" | "warning" | "outline" | "default" | null | undefined;
                    let text;

                    switch (row.original.status) {
                        case OrderStatus.NEEDS_APPROVAL:
                            variant = "warning";
                            text = "Pending";
                            break;
                        case OrderStatus.ACTIVE:
                            variant = "default";
                            text = "Active";
                            break;
                        case OrderStatus.DECLINED:
                            variant = "destructive";
                            text = "Declined";
                            break;
                        case OrderStatus.COMPLETED:
                            variant = "success";
                            text = "Done";
                            break;
                        case OrderStatus.FAILED:
                            variant = "destructive";
                            text = "Failed";
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
                row.original.status === OrderStatus.NEEDS_APPROVAL ? (
                    <OrderDropdownMenu
                        onApprove={() => handleApprove(row.original)}
                        onDecline={() => handleDecline(row.original)}
                    />
                ) : null,
            enableHiding: false,
        },
    ];
}

