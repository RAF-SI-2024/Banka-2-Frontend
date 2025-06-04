import { useState, useEffect, useMemo } from "react";
import {useReactTable, getCoreRowModel, getPaginationRowModel, VisibilityState} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/__common__/datatable/DataTable";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination";
import { mockOrders } from "@/mocks/OrdersMock";
import {Order, Status} from "@/types/exchange/order.ts";
import {DataTableViewOptions} from "@/components/__common__/datatable/DataTableViewOptions.tsx";
import {generateOrderColumns} from "@/components/order-table/OrderListColumnDef.tsx";

export default function OrderList() {
    const [search, setSearch] = useState<{ status: Status | "" }>({ status: "" });
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
    }, []);

    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setFilteredOrders(orders.slice(start, end));
    }, [currentPage, pageSize, orders]);

    const handleSearchChange = (field: keyof typeof search, value: string) => {
        setSearch(prev => ({ ...prev, [field]: value as Status | "" }));
    };

    const handleFilter = () => {
        const selectedStatus = search.status;
        const filtered = selectedStatus !== ""
            ? orders.filter(order => order.status === Number(search.status))
            : orders;

        setFilteredOrders(filtered.slice(0, pageSize));
        setCurrentPage(1);
    };

    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        orderType: false,
        securityType: false,
        contractSize: false,
        pricePerUnit: false,
        creationDate: false,
    });



    const handleClearSearch = () => {
        setSearch({ status: "" });
        setFilteredOrders(orders.slice(0, pageSize));
        setCurrentPage(1);
    };

    const columns = useMemo(() => {
        const handleApprove = (order: Order) => {
            console.log("Approve", order);
        }
        const handleDecline = (order: Order) => {
            console.log("Decline", order);
        }
        return generateOrderColumns(handleApprove, handleDecline)}
    , [orders]);

    const table = useReactTable({
        data: filteredOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        manualPagination: true,
        pageCount: Math.ceil(orders.length / pageSize),
        state: {
            columnVisibility,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize,
            },
        },
        onPaginationChange: updater => {
            if (typeof updater === "function") {
                const newPagination = updater({ pageIndex: currentPage - 1, pageSize });
                setCurrentPage(newPagination.pageIndex + 1);
                setPageSize(newPagination.pageSize);
            } else {
                setCurrentPage(updater.pageIndex + 1);
                setPageSize(updater.pageSize);
            }
        },
    });

    return (
        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                <div className="flex flex-wrap gap-4 items-center">
                    <Select onValueChange={(value) => handleSearchChange("status", value)} value={search.status?.toString()}>
                        <SelectTrigger className="w-42">
                            <SelectValue placeholder="Filter by status" className="text-sm" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectItem value={Status.Pending.toString()}>Pending</SelectItem>
                            <SelectItem value={Status.Approved.toString()}>Approved</SelectItem>
                            <SelectItem value={Status.Declined.toString()}>Declined</SelectItem>
                            <SelectItem value={Status.Done.toString()}>Done</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                        <Button onClick={handleFilter} variant="primary">
                            <span className="icon-[ph--funnel]" />
                            Filter
                        </Button>
                        <Button onClick={handleClearSearch} disabled={search.status === ""} variant="secondary">
                            <span className="icon-[ph--funnel-x]" />
                            Clear
                        </Button>
                    </div>
                </div>

                <div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <DataTable<Order> table={table} />
            <DataTablePagination table={table} />
        </div>
    );
}