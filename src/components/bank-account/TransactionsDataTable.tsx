import {useState, useEffect, useMemo} from "react";
import { DataTable } from "@/components/common/datatable/DataTable.tsx";
import { getCoreRowModel } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {Transaction, TransactionResponse} from "@/types/transaction.ts";
import {BankAccount} from "@/types/bankAccount.ts";
import { getAccountTransactions, getAllTransactions } from "@/api/bankAccount.ts";
import { TransactionStatus } from "@/types/enums.ts";

interface TransactionsDataTableProps {
    account: BankAccount | null;
    // Id transactionType = 0 show all transactions, if its 1 show exchange/transfer
    transactionType: number;
}

export default function TransactionsDataTable({account, transactionType}: TransactionsDataTableProps) {
    /* STATES */
    // edit

    const [search, setSearch] = useState({
        fromAmount: "",
        toAmount: "",
        status: "",
    });

    const [appliedSearch, setAppliedSearch] = useState(search);

    const isSearchActive = Object.values(search).some(value => value !== "");

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

    // filtering
    const [fetchFlag, setFetchFlag] = useState(false); // Filter A
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

    function generateMockTransactions() {
        //row.original.currencyFrom
        const mockData = [
            {
                id: 1,
                fromAccount: { accountNumber: '111111111' },
                toAccount: { accountNumber: '222222222' },
                date: '2024-03-05T10:30:00.000Z',
                createdAt: '2024-03-05T10:30:00.000Z',
                purpose: 'Payment for services',
                fromAmount: 100.50,
                toAmount: 90.50,
                status: TransactionStatus.Completed,
                currencyFrom: {
                    id: "123",
                    name: "USD",
                    code: "USD",
                    symbol: "USD",
                    //countries: Country[];
                    description: "Valuta",
                    status: true,
                    createdAt: '2024-03-05T10:30:00.000Z',
                    modifiedAt: '2024-03-05T10:30:00.000Z'
                },
                currencyTo: {
                    id: "123",
                    name: "USD",
                    code: "USD",
                    symbol: "USD",
                    //countries: Country[];
                    description: "Valuta",
                    status: true,
                    createdAt: '2024-03-05T10:30:00.000Z',
                    modifiedAt: '2024-03-05T10:30:00.000Z'
                },
            },
            {
                id: 2,
                fromAccount: { accountNumber: '333333333' },
                toAccount: { accountNumber: '444444444' },
                date: '2024-03-06T12:00:00.000Z',
                createdAt: '2024-03-05T10:30:00.000Z',
                purpose: 'Loan repayment',
                fromAmount: 250,
                toAmount: 300,
                status: TransactionStatus.Pending,
                currencyFrom: {
                    id: "123",
                    name: "USD",
                    code: "USD",
                    symbol: "USD",
                    //countries: Country[];
                    description: "Valuta",
                    status: true,
                    createdAt: '2024-03-05T10:30:00.000Z',
                    modifiedAt: '2024-03-05T10:30:00.000Z'
                },
                currencyTo: {
                    id: "123",
                    name: "USD",
                    code: "USD",
                    symbol: "USD",
                    //countries: Country[];
                    description: "Valuta",
                    status: true,
                    createdAt: '2024-03-05T10:30:00.000Z',
                    modifiedAt: '2024-03-05T10:30:00.000Z'
                },
            },
            {
                id: 3,
                fromAccount: { accountNumber: '555555555' },
                toAccount: { accountNumber: '666666666' },
                date: '2024-03-07T14:45:00.000Z',
                createdAt: '2024-03-05T10:30:00.000Z',
                purpose: 'Salary payment',
                fromAmount: 1500,
                toAmount: 1000,
                status: TransactionStatus.Completed,
                currencyFrom: {
                    id: "123",
                    name: "USD",
                    code: "USD",
                    symbol: "USD",
                    //countries: Country[];
                    description: "Valuta",
                    status: true,
                    createdAt: '2024-03-05T10:30:00.000Z',
                    modifiedAt: '2024-03-05T10:30:00.000Z'
                },
                currencyTo: {
                    id: "123",
                    name: "USD",
                    code: "USD",
                    symbol: "USD",
                    //countries: Country[];
                    description: "Valuta",
                    status: true,
                    createdAt: '2024-03-05T10:30:00.000Z',
                    modifiedAt: '2024-03-05T10:30:00.000Z'
                },
            }
        ];

        // @ts-expect-error Missing few datatypes, not important for mock data
        setTransactions(mockData)
    }

    // fetch users effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        // account is null when we open overview page, account has a value if we open account component
        if (account === null) {
            fetchAllTransactions();
            if (transactions.length === 0)
                generateMockTransactions()
        } else {
            fetchAccountTransactions();
            if (transactions.length === 0)
                generateMockTransactions()
        }
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    // If the data table is used in the overview page
    const fetchAllTransactions = async () => {
        console.log("Fetching transactions");
        setError(null);
        try {
            const transactionsData: TransactionResponse = await getAllTransactions(
                currentPage,
                pageSize,
                transactionType
            );
            setTransactions(transactionsData.items);
            setTotalPages(transactionsData.totalPages);
            console.log(transactionsData)
        }
        catch (err) {
            console.log(err);
            //setError("Failed to fetch transactions");
        }
    };

    // If the data table is used in the account component
    const fetchAccountTransactions = async () => {
        console.log("Fetching transactions");
        setError(null);
        try {
            const transactionsData: TransactionResponse = await getAccountTransactions(
                currentPage,
                pageSize,
                transactionType,
                account?.id,
            );
            setTransactions(transactionsData.items);
            setTotalPages(transactionsData.totalPages);
            console.log(transactionsData)

        } catch (err) {
            console.log(err);
           // setError("Failed to fetch transactions");
        }
    };

    const handleSearchChange = (field: string, value: string | number) => {
        setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    const handleFilter = () => { 
        setAppliedSearch(search);
    };

    const handleClear = async () => { 
        setSearch({
            fromAmount: "",
            toAmount: "",
            status: "",
        });
        setAppliedSearch({
            fromAmount: "",
            toAmount: "",
            status: "",
        });
        setFetchFlag(!fetchFlag);
    };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        if(account != null)
            return generateTransactionColumns();
        else return []
    }, []); // Empty dependency array since handleOpenEditDialog is now inside

    const mapStatus = (statusCode: TransactionStatus): TransactionStatus | null => {
        switch (statusCode) {
            case TransactionStatus.Invalid:
                return TransactionStatus.Invalid;
            case TransactionStatus.Pending:
                return TransactionStatus.Pending;
            case TransactionStatus.Canceled:
                return TransactionStatus.Canceled;
            case TransactionStatus.Completed:
                return TransactionStatus.Completed;
            case TransactionStatus.Failed:
                return TransactionStatus.Failed;
            default:
                return null;
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const fromAmountNum = Number(appliedSearch.fromAmount);
            const toAmountNum = Number(appliedSearch.toAmount);
            const transactionAmount = transaction.fromAmount - transaction.toAmount;

            if (appliedSearch.fromAmount && transactionAmount < fromAmountNum) {
                return false;
            }
            if (appliedSearch.toAmount && transactionAmount > toAmountNum) {
                return false;
            }
            if (appliedSearch.status && transaction.status !== mapStatus(Number(appliedSearch.status) as TransactionStatus)) {
                return false;
            }
            return true;
        });
    }, [transactions, appliedSearch]);

    // create the table instance with pagination, sorting, and column visibility
    const table = useReactTable({
        data: filteredTransactions,
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
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex flex-row gap-4">
                        {/* Uklanja strelice sa input[type=number] polja */}
                        <style>{`
                            input[type=number]::-webkit-inner-spin-button, 
                            input[type=number]::-webkit-outer-spin-button {  
                                -webkit-appearance: none;
                                margin: 0;
                            }

                            input[type=number] {
                                -moz-appearance: textfield;
                            }
                        `}</style>

                        <Input
                            type="number"
                            placeholder="From amount"
                            value={search.fromAmount}
                            onChange={(e) => handleSearchChange("fromAmount", e.target.value ? Number(e.target.value) : "")}
                            className="w-42"
                        />
                        <Input
                            type="number"
                            placeholder="To amount"
                            value={search.toAmount}
                            onChange={(e) => handleSearchChange("toAmount", e.target.value ? Number(e.target.value) : "")}
                            className="w-42"
                        />
                    </div>

                    <Select onValueChange={(value) => handleSearchChange("status", value)} value={search.status}>
                        <SelectTrigger className="w-42">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Invalid</SelectItem>
                            <SelectItem value="1">Pending</SelectItem>
                            <SelectItem value="2">Canceled</SelectItem>
                            <SelectItem value="3">Completed</SelectItem>
                            <SelectItem value="4">Failed</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
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