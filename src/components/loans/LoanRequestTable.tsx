import {useState, useEffect, useMemo} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserResponse } from "@/types/user.ts";
import { getAllUsers } from "@/api/user.ts";
import { EditUserDialog } from "../admin/EditUserDialog";
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
import {generateUserColumns} from "@/components/usertable/UserListColumnDef.tsx";
import { getAllLoans } from "@/api/loan";
import { Loan, LoanResponse } from "@/types/loan";
import { generateLoanColumns } from "./LoanListColumnDef";

// Postoji filter po vrsti kredita i broju računa
export default function LoanRequestTable() {
    /* STATES */
    const [search, setSearch] = useState({
        // loanType: "",
        accountNumber: "",
    });

    // search active - to display clear button
    const isSearchActive = Object.values(search).some(value => value !== "");

    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    // current user list
    const [loans, setLoans] = useState<Loan[]>([]);

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
        creationDate: false,
        uniqueIdentificationNumber: false,
        currency: false,
        interestType: false,
        period: false,
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch loan reqests function
    const fetchAllLoans = async () => {
        console.log("Fetching loan requests");
        setError(null);
        try {
            const loansData: LoanResponse = await getAllLoans(
                currentPage,
                pageSize,
                search
            );
            setLoans(loansData.items);
            setTotalPages(loansData.totalPages);
            console.log(loansData)
        } catch (err) {
            console.log(err);
            setError("Failed to fetch users");
        }
    };

    // handle search change
    const handleSearchChange = (field: string, value: string) => {
        setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    // handle filter button click
    const handleFilter = () => {
        setFetchFlag(!fetchFlag);
    };

    // handle clear button in search
    const handleClearSearch = async () => {
        console.log("Clearing search...");
        // Reset search and fetch immediately
        setSearch({
            // loanType: "",
            accountNumber: "",
        });
        setFetchFlag(!fetchFlag);
    };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        // Define handleOpenEditDialog inside useMemo
        const handleApprove = (loan: Loan) => {
            // TODO: Call API to update loan status to 1 -> WAIT FOR BACKEND
        }
        const handleReject = (loan: Loan) => {
            // TODO: Call API to update loan status to 0 -> WAIT FOR BACKEND
        }
        // Return generated columns
        return generateLoanColumns(handleApprove, handleReject);
    }, []); // Empty dependency array since handleOpenEditDialog is now inside

    // create the table instance with pagination, sorting, and column visibility
    const table = useReactTable({
        data: loans,
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

    // fetch loans effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        fetchAllLoans();
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
            {/* 🔍 Search Filters */}
                <div className="flex flex-wrap gap-4 items-center">

                    <Input
                        placeholder="Filter by account number"
                        value={search.accountNumber}
                        onChange={(e) => handleSearchChange("accountNumber", e.target.value)}
                        className="w-88"
                    />
                    <div className="flex items-center space-x-2">
                        <Button onClick={handleFilter} variant="primary">
                            <span className="icon-[ph--funnel]" />
                            Filter
                        </Button>
                        <Button onClick={handleClearSearch} variant="secondary" disabled={!isSearchActive}>
                            <span className="icon-[ph--funnel-x]" />
                            Clear
                        </Button>

                    </div>
                </div>
                <div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            {/* 📋 Loans Table */}

            <DataTable
                key={`${currentPage}-${pageSize}`} // Re-render on pagination changes
                table={table}
            />


            {/* Pagination Controls */}
            <DataTablePagination table={table} />

        </div>
    );
}