import {useState, useEffect, useMemo} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserResponse } from "@/types/user.ts";
import { getAllUsers } from "@/api/user.ts";
import { EditUserDialog } from "../../admin/EditUserDialog";
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
import { getAllLoans, getAllLoanTypes } from "@/api/loan";
import { Loan, LoanResponse } from "@/types/loan";
import { LoanType, LoanTypeResponse } from "@/types/loanType";
import { showErrorToast } from "@/utils/show-toast-utils";
import { generateAllLoanColumns } from "./AllLoanListColumnDef";

// Postoji filter po vrsti kredita i broju računa
export default function AllLoanTable() {
    /* STATES */
    const [search, setSearch] = useState({
        loanTypeName: "",
        accountNumber: "",
        loanStatus: "",
    });

    // search active - to display clear button
    const isSearchActive = Object.values(search).some(value => value !== "");

    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    // current loans list
    const [loans, setLoans] = useState<Loan[]>([]);

    // loan types list
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // error
    const [error, setError] = useState<string | null>(null);

    // sorting state
    const [sorting, setSorting] = useState<SortingState>([{id: "accountNumber", desc: true}]); // newest first

    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        creationDate: false,
        currency: false,
        interestType: false,
        // period: false,
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch loan reqests function
    const fetchAllLoans = async () => {
        let searchParams = { ...search };
        if (search.loanTypeName !== "") {
            fetchAllLoanTypes();
            for (let i = 0; i < loanTypes.length; i++) {
                if (loanTypes[i].name === search.loanTypeName) {
                    searchParams.loanTypeName = loanTypes[i].id;
                    console.log("Loan type id: " + searchParams.loanTypeName);
                    break;
                }
            }
        }

        setError(null);
        try {
            const loansData: LoanResponse = await getAllLoans(
                currentPage,
                pageSize,
                searchParams
            );
            setLoans(loansData.items);
            setTotalPages(loansData.totalPages);
            console.log(loansData)
        } catch (err) {
            console.log(err);
            showErrorToast({error, defaultMessage: "Error fetching loans (filters must be written precisely)."});
        }
    };

    const fetchAllLoanTypes = async () => {
        console.log("Fetching loan types...");
        try {
            const loanTypesData: LoanTypeResponse = await getAllLoanTypes(
                currentPage,
                pageSize
            );
            setLoanTypes(loanTypesData.items);
        } catch (err) {
            console.error("Failed to fetch loan types:", err);
            setError("Failed to fetch loan types");
        }
    }

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
            loanTypeName: "",
            accountNumber: "",
            loanStatus: "",
        });
        setFetchFlag(!fetchFlag);
    };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        // Return generated columns
        return generateAllLoanColumns();
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
                        className="w-58"
                    />
                    <Input
                        placeholder="Filter by loan type"
                        value={search.loanTypeName}
                        onChange={(e) => handleSearchChange("loanTypeName", e.target.value)}
                        className="w-58"
                    />
                    <Input
                        placeholder="Filter by status"
                        value={search.loanStatus}
                        onChange={(e) => handleSearchChange("loanStatus", e.target.value)}
                        className="w-58"
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