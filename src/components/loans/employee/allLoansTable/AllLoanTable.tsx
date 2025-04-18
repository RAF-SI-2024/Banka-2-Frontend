import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/__common__/datatable/DataTable.tsx";
import { getCoreRowModel } from "@tanstack/react-table";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination";
import { DataTableViewOptions } from "@/components/__common__/datatable/DataTableViewOptions";
import {
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import { getAllLoans, getAllLoanTypes } from "@/api/bank_user/loan.ts";
import { Loan, LoanResponse } from "@/types/bank_user/loan.ts";
import { LoanType, LoanTypeResponse } from "@/types/bank_user/loan-type.ts";
import { showErrorToast } from "@/lib/show-toast-utils.tsx";
import { generateAllLoanColumns } from "./AllLoanListColumnDef";
import {LoanStatus} from "@/types/bank_user/loan.ts";

// Postoji filter po vrsti kredita i broju računa
export default function AllLoanTable() {
    /* STATES */
    const [search, setSearch] = useState({
        loanTypeName: "",
        accountNumber: "",
        loanStatus: LoanStatus.Active.toString(),
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
    const [sorting, setSorting] = useState<SortingState>([{ id: "accountNumber", desc: true }]); // newest first

    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        creationDate: false,
        maturityDate: false,
        currency: false,
        interestType: false,
        period: false,
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch all loans function
    const fetchAllLoans = async () => {
        let searchParams = { ...search };
        if (search.loanTypeName !== "") {
            fetchAllLoanTypes();
            for (let i = 0; i < loanTypes.length; i++) {
                if (loanTypes[i].name === search.loanTypeName) {
                    searchParams.loanTypeName = loanTypes[i].id;
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
            showErrorToast({ error, defaultMessage: "Error fetching loans (filters must be written precisely)." });
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
        setCurrentPage(1);
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
        fetchAllLoanTypes();
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

                    <Select onValueChange={(value) => handleSearchChange("loanTypeName", value)} value={search.loanTypeName}>
                        <SelectTrigger className="w-42">
                            <SelectValue placeholder="Filter by loan type" />
                        </SelectTrigger>
                        <SelectContent>
                            {loanTypes.map((loanType) => (
                                <SelectItem key={loanType.id} value={loanType.id}>
                                    {loanType.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => handleSearchChange("loanStatus", value)} value={search.loanStatus}>
                        <SelectTrigger className="w-42">
                            <SelectValue placeholder="Filter by status" className="text-sm"/>
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectItem value={LoanStatus.Pending.toString()}> Pending </SelectItem>
                            <SelectItem value={LoanStatus.Active.toString()}> Active </SelectItem>
                            <SelectItem value={LoanStatus.Rejected.toString()}> Rejected </SelectItem>
                            <SelectItem value={LoanStatus.Closed.toString()}> Closed </SelectItem>
                        </SelectContent>
                    </Select>

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