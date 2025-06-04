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

export default function PortfolioTable() {

    // current portfolio data
    const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);

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
    const [selectedRow, setSelectedRow] = useState<PortfolioData | null>(null);

    const [sliderValue, setSliderValue] = useState<number[]>([selectedRow?.public ?? 0]);

    useEffect(() => {
        setSliderValue([selectedRow?.public ?? 0]);
    }, [selectedRow]);

    const handleSliderChange = (newValue: number[]) => {
        setSliderValue(newValue);
        setSelectedRow((prev) => prev ? { ...prev, public: newValue[0] > prev.amount ? prev.amount : (newValue[0] < 0 ? 0 : newValue[0]) } : null);
    };

    const handleSave = () => {
        if (selectedRow) {
            setPortfolioData((prevData) => {
                return prevData.map((item) => {
                    if (item.ticker === selectedRow.ticker) {
                        return { ...item, public: sliderValue[0] };
                    }
                    return item;
                });
            });
        }
        setOpen(false);
    };

    /* FUNCTIONS */
    // fetch portfolio data function
    const fetchPortfolioData = async () => {
        console.log("Fetching portfolio data");
        setError(null);
        try {
            // const portfolioData: PortfolioData = await getAllUsers(
            //     currentPage,
            //     pageSize
            // );
            //
            //
            // setTotalPages(portfolioData.totalPages);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch portfolio data");
        }
    };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        // Return generated columns
        setPortfolioData(portfolioDataMock);
        return generatePortfolioColumns(setOpen, setSelectedRow);
    }, []); // Empty dependency array since handleOpenEditDialog is now inside

    // create the table instance with pagination, sorting, and column visibility
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change amount of public assets</DialogTitle>
                        <DialogDescription>
                            <DualRangeSlider
                                className="mt-8"
                                label={(value) => value}
                                value={sliderValue}
                                onValueChange={handleSliderChange}
                                min={0}
                                max={selectedRow?.amount}
                                step={1}
                            />
                            <Input
                                className="mt-4"
                                type="number"
                                value={sliderValue[0]}

                                onChange={(e) => handleSliderChange([Number(e.target.value)])}
                            />
                        </DialogDescription>
                    </DialogHeader>
                    <Button variant="gradient" onClick={handleSave}>Save</Button>
                </DialogContent>
            </Dialog>

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