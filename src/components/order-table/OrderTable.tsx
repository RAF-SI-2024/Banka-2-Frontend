import {useEffect, useMemo, useState} from "react";
import {getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DataTable} from "@/components/__common__/datatable/DataTable";
import {DataTablePagination} from "@/components/__common__/datatable/DataTablePagination";
import {Order, OrderResponse, OrderStatus, stringToOrderStatus} from "@/types/exchange/order.ts";
import {DataTableViewOptions} from "@/components/__common__/datatable/DataTableViewOptions.tsx";
import {generateOrderColumns} from "@/components/order-table/OrderListColumnDef.tsx";
import {editOrder, getAllOrders} from "@/api/exchange/order.ts";

export default function OrderList() {
    const [search, setSearch] = useState<{ status: string }>({ status: "" });
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // error
    const [error, setError] = useState<string | null>(null);

    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    const fetchOrders = async () => {
        setError(null);

        const statusFilter = search.status == "" ? null : Number(search.status);
        try {
            const ordersData: OrderResponse = await getAllOrders(
                statusFilter,
                currentPage,
                pageSize
            );
            setOrders(ordersData.items);
            setTotalPages(ordersData.totalPages);
        } catch (err) {
            setError("Failed to fetch orders");
        }
    };

    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setFilteredOrders(orders.slice(start, end));
    }, [currentPage, pageSize, orders]);

    const handleSearchChange = (field: keyof typeof search, value: string) => {
        setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    const handleFilter = () => {
        setCurrentPage(1);
        setFetchFlag(!fetchFlag);
    };

    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        orderType: false,
        securityType: false,
        contractCount: false,
        // pricePerUnit: false,
        creationDate: false,
    });



    const handleClearSearch = () => {
        setSearch({ status: "" });
        setCurrentPage(1);
        setFetchFlag(!fetchFlag);
    };

    const handlePut = async (id: string, status: OrderStatus) => {
        try {
            await editOrder(id, {status: status});
            setFetchFlag(!fetchFlag);
        } catch (err) {
            setError("Failed to update order status");
        }
    }

    const columns = useMemo(() => {
        const handleApprove = (order: Order) => {
            handlePut(order.id, OrderStatus.ACTIVE);
        }
        const handleDecline = (order: Order) => {
            handlePut(order.id, OrderStatus.DECLINED);
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
        pageCount: totalPages,
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

    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                <div className="flex flex-wrap gap-4 items-center">
                    <Select onValueChange={(value) => handleSearchChange("status", value)} value={search.status?.toString()}>
                        <SelectTrigger className="w-42">
                            <SelectValue placeholder="Filter by status" className="text-sm" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectItem value={OrderStatus.NEEDS_APPROVAL.toString()}>Pending</SelectItem>
                            <SelectItem value={OrderStatus.ACTIVE.toString()}>Approved</SelectItem>
                            <SelectItem value={OrderStatus.DECLINED.toString()}>Declined</SelectItem>
                            <SelectItem value={OrderStatus.COMPLETED.toString()}>Done</SelectItem>
                            <SelectItem value={OrderStatus.FAILED.toString()}>Failed</SelectItem>
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