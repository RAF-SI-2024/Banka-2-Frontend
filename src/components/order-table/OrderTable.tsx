import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/__common__/datatable/DataTable";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination";
import { Badge } from "@/components/ui/badge";
import { mockOrders } from "@/mocks/OrdersMock";
import { formatCurrency } from "/src/lib/format-currency.ts";
import { formatNumber } from "/src/lib/format-number.ts";
import { Order } from "@/types/order.ts";
import OrderDropdownMenu from "./OrderActionMenu.tsx";
// showSuccessToast} from "@/lib/show-toast-utils.tsx";

export default function OrderTable() {
    const [search, setSearch] = useState({ status: "" });
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    useEffect(() => {
        setOrders(mockOrders);
    }, []);

    useEffect(() => {
        let filtered = orders.filter(order =>
            (search.status ? order.status === search.status : true)
        );
        setFilteredOrders(filtered);
    }, [search, orders]);

    const handleSearchChange = (field: keyof typeof search, value: string) => {
        setSearch(prev => ({ ...prev, [field]: value }));
    };

    const handleClearSearch = () => {
        setSearch({ status: "" });
    };

    const columns = useMemo(() => [
        { accessorKey: "email", header: "Email" },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "orderType", header: "Order Type" },
        {
            accessorKey: "quantity",
            header: "Quantity",
            cell: ({ row }) => formatNumber(row.original.quantity, true)
        },
        {
            accessorKey: "contractSize",
            header: "Contract Size",
            cell: ({ row }) => formatNumber(row.original.contractSize, true)
        },
        {
            accessorKey: "pricePerUnit",
            header: "Price per Unit",
            cell: ({ row }) => formatCurrency(row.original.pricePerUnit)
        },
        {
            accessorKey: "direction",
            header: "Direction",
            cell: ({ row }) => (
                <Badge variant={row.original.direction === "Buy" ? "success" : "destructive"}>
                    {row.original.direction}
                </Badge>
            )
        },
        {
            accessorKey: "remainingPortions",
            header: "Remaining Portions",
            cell: ({ row }) => formatNumber(row.original.remainingPortions, true)
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={
                    row.original.status === "pending" ? "warning" :
                        row.original.status === "approved" ? "default" :
                            row.original.status === "declined" ? "destructive" : "success"
                }>
                    {row.original.status}
                </Badge>
            )
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                row.original.status === "pending" ? (
                    <OrderDropdownMenu
                        onEdit={() => console.log("Edit order", row.original)}
                        onDelete={() => console.log("Delete order", row.original)}
                    />
                ) : null
            )
        }
    ], []);

    // Kreiranje tabele sa eksplicitnim tipom Order
    const table = useReactTable<Order>({
        data: filteredOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
                <Select onValueChange={(value) => handleSearchChange("status", value)} value={search.status}>
                    <SelectTrigger className="text-sm py-1 px-2 w-32">
                        <SelectValue placeholder="Status" className="text-sm"/>
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleClearSearch} disabled={!search.status} className="text-sm">Clear</Button>
            </div>

            {/* ✅ PROSLEĐUJEMO ISPRAVAN `table` OBJEKAT */}
            <DataTable<Order> table={table}/>
            <DataTablePagination table={table}/>
        </div>

    );
}
