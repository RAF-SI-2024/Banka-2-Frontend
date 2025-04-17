import {useState, useEffect, useMemo} from "react";
import { DataTable } from "@/components/__common__/datatable/DataTable.tsx";
import { getCoreRowModel } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { DatePickerWithRange } from "@/components/ui/date-range-picker.tsx"
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination.tsx";
import { DataTableViewOptions } from "@/components/__common__/datatable/DataTableViewOptions.tsx";
import {
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import {generateTransactionColumns} from "@/components/bank-account/bank-account-single/TransactionsDataTableColumnDef.tsx";
import {Transaction, TransactionResponse, TransactionTableRow} from "@/types/bank_user/transaction.ts";
import {BankAccount} from "@/types/bank_user/bank-account.ts";
import { TransactionStatus } from "@/types/bank_user/transaction.ts";
import { DateRange } from "react-day-picker";
import {fetchTransactionTableRows} from "@/lib/transactions-table-utils.tsx";

interface TransactionsDataTableProps {
    account?: BankAccount;
}

export default function TransactionsDataTable({account}: TransactionsDataTableProps) {
    /* STATES */
    // edit

    const [search, setSearch] = useState({
        fromDate: undefined as Date | undefined,
        toDate: undefined as Date | undefined,
        status: "",
    });

    const clientId: string = JSON.parse(sessionStorage.user).id;

    const isSearchActive = Object.values(search).some(value => value && value !== "");

    // current transaction list
    const [transactions, setTransactions] = useState<TransactionTableRow[]>([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // error
    const [error, setError] = useState<string | null>(null);

    // sorting state
    const [sorting, setSorting] = useState<SortingState>([]);

    // filtering
    const [fetchFlag, setFetchFlag] = useState(false); // Filter A
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);


    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        purpose: false
    });


    // fetch users effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        async function fetchData(){
            setError(null);
            await fetchTransactionTableRows({
                clientId: clientId,
                mode: account ? "all": "bankAccount",
                pageNumber: currentPage,
                pageSize: pageSize,
                fromDate: search.fromDate,
                toDate: search.toDate,
                status: Number(search.status),
                bankAccountId: account ? account.id: undefined,
                setTableData: setTransactions,
                setTotalPages: setTotalPages,
                setError: setError});
        }

        fetchData();

    }, [currentPage, pageSize, fetchFlag, dateRange]); // Add dependencies



    const handleSearchChange = (field: string, value: string | number) => {
        setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    const handleFilter = () => {
        setCurrentPage(1);
        setFetchFlag(!fetchFlag);
    };

    const handleClear = async () => { 
        setSearch({
            fromDate: undefined,
            toDate: undefined,
            status: "",
        });
        setFetchFlag(!fetchFlag);
    };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        return generateTransactionColumns();
    }, []); // Empty dependency array since handleOpenEditDialog is now inside



    // create the table instance with pagination, sorting, and column visibility
    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnVisibility,
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

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="m-2 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
                <div className="w-full flex gap-4 items-center">
                    <div className="flex flex-row gap-4">
                        {/* Uklanja strelice sa input[type=number] polja */}
                        {/*<style>{`*/}
                        {/*    input[type=number]::-webkit-inner-spin-button, */}
                        {/*    input[type=number]::-webkit-outer-spin-button {  */}
                        {/*        -webkit-appearance: none;*/}
                        {/*        margin: 0;*/}
                        {/*    }*/}

                        {/*    input[type=number] {*/}
                        {/*        -moz-appearance: textfield;*/}
                        {/*    }*/}
                        {/*`}</style>*/}

                        {/*<Input*/}
                        {/*    type="number"*/}
                        {/*    placeholder="From amount"*/}
                        {/*    value={search.fromAmount}*/}
                        {/*    onChange={(e) => handleSearchChange("fromAmount", e.target.value ? Number(e.target.value) : "")}*/}
                        {/*    className="w-42"*/}
                        {/*/>*/}
                        {/*<Input*/}
                        {/*    type="number"*/}
                        {/*    placeholder="To amount"*/}
                        {/*    value={search.toAmount}*/}
                        {/*    onChange={(e) => handleSearchChange("toAmount", e.target.value ? Number(e.target.value) : "")}*/}
                        {/*    className="w-42"*/}
                        {/*/>*/}

                        <Select onValueChange={(value) => handleSearchChange("status", value)} value={search.status}>
                            <SelectTrigger className="w-42">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TransactionStatus.Invalid.toString()}>Invalid</SelectItem>
                                <SelectItem value={TransactionStatus.Pending.toString()}>Pending</SelectItem>
                                <SelectItem value={TransactionStatus.Canceled.toString()}>Canceled</SelectItem>
                                <SelectItem value={TransactionStatus.Completed.toString()}>Completed</SelectItem>
                                <SelectItem value={TransactionStatus.Failed.toString()}>Failed</SelectItem>
                            </SelectContent>
                        </Select>

                        <DatePickerWithRange
                            date={{ from: search.fromDate, to: search.toDate }}
                            setDate={(range) => {
                                if(range) {
                                    const rangeDate: DateRange = range as DateRange;
                                    setSearch(prev => ({
                                        ...prev,
                                        fromDate: rangeDate?.from,
                                        toDate: rangeDate?.to,
                                    }));
                                }

                            }}
                        />

                    </div>

                    <div className="w-full flex items-center space-x-2 justify-end mr-2">
                        <Button onClick={handleFilter} variant="primary">
                            <span className="icon-[ph--funnel]" />
                            Filter
                        </Button>
                        <Button onClick={handleClear} variant="secondary">
                            <span className="icon-[ph--funnel-x]" />
                            Clear
                        </Button>
                    </div>
                </div>

                <div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            {/* 📋 Transactions Table */}

            <DataTable
                key={`${currentPage}-${pageSize}`} // Re-render on pagination changes
                table={table}
            />


            {/* Pagination Controls */}
            <DataTablePagination table={table} />
        </div>
    );
}