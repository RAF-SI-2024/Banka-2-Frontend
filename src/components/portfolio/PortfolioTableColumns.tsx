import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {createOrder} from "@/api/exchange/order.ts";
import {CreateOrderRequest, OrderDirection, OrderType} from "@/types/exchange/order.ts";
import {Asset} from "@/types/exchange/asset.ts";


export function generatePortfolioColumns(setOpen: (open: boolean) => void, setSelectedRow: (row: Asset) => void): ColumnDef<Asset>[] {    return [
        // {
        //     // accessorKey: "type",
        //     // header: "Type",
        //     // cell: ({ row }) => (
        //     //     OrderType[row.original.orderType]
        //     // ),
        // },
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
const handleSell = async (item: Asset) => {

    const accountNumber = item.actuary.account.accountNumber;
    if(!accountNumber){
        return;
    }
    // TODO: FIX this, ASSET DOESNT HAVE REQUIRED FIELDS
    const orderRequest : CreateOrderRequest = {
        actuaryId: item.actuary.id,
        accountNumber: String(accountNumber) ,
        orderType: OrderType.MARKET,
        quantity: item.quantity,
        contractCount: 1,
        limitPrice: 200,
        stopPrice: 150,
        direction: OrderDirection.SELL,
        securityId: item.security.id

    }
    try{
        await createOrder(orderRequest)

    }catch (error){
        console.error("asdfsadadas", error);
    }
};
