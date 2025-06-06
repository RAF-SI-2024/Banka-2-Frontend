import {useEffect, useMemo, useState} from "react";

import {
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {DataTableViewOptions} from "@/components/__common__/datatable/DataTableViewOptions.tsx";
import {DataTable} from "@/components/__common__/datatable/DataTable.tsx";
import {DataTablePagination} from "@/components/__common__/datatable/DataTablePagination.tsx";
import {generatePortfolioColumns} from "@/components/portfolio/PortfolioTableColumns.tsx";
import {PortfolioData} from "@/types/exchange/portfolio-data.ts";
import {portfolioDataMock} from "@/__mocks/PortfolioDataMock.ts";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DualRangeSlider} from "@/components/ui/dual-range-slider.tsx";
import {Input} from "@/components/ui/input.tsx";
import {getAllOrders} from "@/api/exchange/order.ts";
import {Order, OrderResponse} from "@/types/exchange/order.ts";
import {Currency} from "@/types/bank_user/currency.ts";

export default function PortfolioTable() {

    // current portfolio data
    const [portfolioData, setPortfolioData] = useState<Order[]>([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // error
    const [error, setError] = useState<string | null>(null);

    // sorting state
    const [sorting, setSorting] = useState<SortingState>([]);

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Open slider dialog
    const [open, setOpen] = useState(false);
    // Selected row from which slider appears
    const [selectedRow, setSelectedRow] = useState<Order | null>(null);

    /* FUNCTIONS */
    // fetch portfolio data function
    const fetchPortfolioData = async () => {
        console.log("Fetching portfolio data");
        setError(null);
        try {
            const response: OrderResponse = await getAllOrders(
                null,
                currentPage,
                pageSize
            );

            setPortfolioData(response.items)
            setTotalPages(response.totalPages);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch portfolio data");
        }
    };

    const columns = useMemo(() => {
        return generatePortfolioColumns(setOpen, setSelectedRow);
    }, []);

    const table = useReactTable({
        data: portfolioData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") { // we will use this
                const newPagination = updater(table.getState().pagination);
                setCurrentPage(newPagination.pageIndex + 1);
                setPageSize(newPagination.pageSize);
            } else { // this is only to avoid error
                const newPagination = updater;
                setCurrentPage(newPagination.pageIndex + 1);
                setPageSize(newPagination.pageSize);
            }

        },
        manualPagination: true,
        pageCount: totalPages,
    });

    // fetch users effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        fetchPortfolioData();
    }, [currentPage, pageSize]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
                <div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            {/* 📋 Portfolio table */}

            <DataTable
                key={`${currentPage}-${pageSize}`} // Re-render on pagination changes
                table={table}
            />

            {/* Pagination Controls */}
            <DataTablePagination table={table} />

        </div>
    );
}