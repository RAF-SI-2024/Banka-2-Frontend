import {getGenderString, getRoleString, User} from "@/types/bank_user/user.ts";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import UserDropdownMenu from "@/components/user-table/all-users/UserDropdownMenu.tsx";
import {PortfolioData} from "@/types/exchange/portfolio-data.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {createOrder} from "@/api/exchange/order.ts";
import {CreateOrderRequest, Order, OrderDirection, OrderType} from "@/types/exchange/order.ts";

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-RS') + " (" + date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit'}) + ")"
};

export function generatePortfolioColumns(setOpen: (open: boolean) => void, setSelectedRow: (row: Order) => void): ColumnDef<Order>[] {    return [
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                OrderType[row.original.orderType]
            ),
        },
        {
            accessorKey: "ticker",
            header: "Ticker",
            cell: ({ row }) => (
                row.original.security.ticker
            ),
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => (
                row.original.quantity
            ),
        },
        // {
        //     accessorKey: "price",
        //     header: "Price",
        //     cell: ({row}) => {
        //         return (formatCurrency(row.original., row.original.currency.code))
        //     },
        //     enableHiding: true,
        // },
        // {
        //     accessorKey: "profit_loss",
        //     header: "Profit/Loss",
        //     cell: ({row}) => {
        //         return (formatCurrency(row.original.price, row.original.currency.code))
        //     },
        //     enableHiding: true,
        // },
        // {
        //     accessorKey: "lastModified",
        //     header: "Last Modified",
        //     cell: ({ row }) => {
        //         return (new Date(row.original.)).toLocaleString("sr-RS")
        //     },
        //     enableHiding: true,
        // },
        // {
        //     accessorKey: "public",
        //     header: "Public",
        //     enableHiding: true,
        // },
        // {
        //     id: "change",
        //     header: "Change public",
        //     cell: ({ row }) => (
        //         <Button variant="gradient" onClick={() => {
        //             setSelectedRow(row.original);
        //             setOpen(true);
        //         }}>
        //             Change
        //         </Button>
        //     ),
        // },
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
const handleSell = async (item: Order) => {
    if(!item.account.accountNumber){
        return;
    }
    const orderRequest : CreateOrderRequest = {
        actuaryId: item.actuary.id,
        accountNumber: String(item.account.accountNumber) ,
        orderType: item.orderType,
        quantity: item.quantity,
        contractCount: item.contractCount,
        limitPrice: item.limitPrice,
        stopPrice: item.stopPrice,
        direction: OrderDirection.SELL,
        securityId: item.security.id

    }
    try{
        await createOrder(orderRequest)

    }catch (error){
        console.error("asdfsadadas", error);
    }
};
/*
{
  "actuaryId": "a8be210e-84f9-472e-9f0a-f2f334dcb20a",
  "orderType": "Market",
  "quantity": 100,
  "contractCount": 10,
  "limitPrice": 250.75,
  "stopPrice": 222.22,
  "direction": "Buy",
  "supervisorId": "e1f3de40-719e-4b5f-8e4d-d42f06e4a411",
  "accountNumber": "000000005",
  "securityId": "9000bb03-afac-4ab5-80f3-980a0ed898f2"
}
 */