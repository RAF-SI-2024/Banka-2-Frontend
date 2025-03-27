import OrderTable from "@/components/order-table/OrderTable";

export default function OrderPage() {
    return (
        <div className="p-6">
            <h1 className="font-display font-bold text-5xl">Orders</h1>
            <OrderTable />
        </div>
    );
}
