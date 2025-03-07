import {useState, useEffect, useMemo} from "react";
import { DataTable } from "@/components/common/datatable/DataTable.tsx";
import { getCoreRowModel} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/common/datatable/DataTablePagination";
import { DataTableViewOptions } from "@/components/common/datatable/DataTableViewOptions";
import {
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import {generateTransactionColumns} from "@/components/bank-account/TransactionsDataTableColumnDef.tsx";
import {Transaction} from "@/types/transaction.ts";
import {BankAccount} from "@/types/bankAccount.ts";

interface TransactionsDataTableProps {
    account: BankAccount
}

export default function TransactionsDataTable({account}: TransactionsDataTableProps) {
    /* STATES */
    // edit

    // current transaction list
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // error
    const [error, setError] = useState<string | null>(null);

    // sorting state
    const [sorting, setSorting] = useState<SortingState>([]);

    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        dateOfBirth: false,
        uniqueIdentificationNumber: false,
        gender: false,
        phoneNumber: false,
        address: false,
        department: false
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch users function
    const fetchTransactions = async () => {
        console.log("Fetching transactions");
        setError(null);
        try {
            // const transactionsData: TransactionsResponse = await getAllTransactions(
            //     currentPage,
            //     pageSize,
            // );
            const transactionsData = {
                items: [
                    {
                        id: "1",
                        name: "Transaction 1",
                        amount: 1000,
                        date: new Date(),
                    },
                    {
                        id: "2",
                        name: "Transaction 2",
                        amount: 2000,
                        date: new Date(),
                    },
                    {
                        id: "3",
                        name: "Transaction 1",
                        amount: 10000.26,
                        date: new Date(),
                    },
                    {
                        id: "4",
                        name: "Transaction 2",
                        amount: 999.99,
                        date: new Date(),
                    },
                    {
                        id: "5",
                        name: "Transaction 1",
                        amount: -1000,
                        date: new Date(),
                    },
                    {
                        id: "6",
                        name: "Transaction 2",
                        amount: -30,
                        date: new Date(),
                    },
                ],
                totalPages: 1,
                currentPage: 1,
            }

            setTransactions(transactionsData.items);
            setTotalPages(transactionsData.totalPages);
            console.log(transactionsData)
        } catch (err) {
            console.log(err);
            setError("Failed to fetch transactions");
        }
    };



    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        // Return generated columns
        return generateTransactionColumns(account.currency);
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

    // fetch users effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        fetchTransactions();
    }, [currentPage, pageSize]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="m-2 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
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