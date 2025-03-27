import OrderTable from "@/components/order-table/OrderTable";
import { Toaster } from "sonner";

export default function OrderPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">Orders</h1>
            <OrderTable />
        </main>
    );
}
