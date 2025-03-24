import OrderTable from "@/components/order-table/OrderTable";

export default function OrderPage() {
    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Orders</h1>
            </div>

            <OrderTable />
        </div>
    );
}
