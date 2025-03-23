import { useState, useEffect, useMemo } from "react";
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
import { Loan, LoanResponse } from "@/types/loan";
import { showErrorToast } from "@/lib/show-toast-utils.tsx";
import { generateLoanOverviewColumns } from "./LoanOverviewListColumnDef";
import { getLoansByClientId } from "@/api/loan";
import { useNavigate } from "react-router-dom";
// import { generateAllLoanColumns } from "./AllLoanListColumnDef";

// Postoji filter po vrsti kredita i broju računa
export default function LoanOverviewTable() {

    // navigate
    const navigate = useNavigate();

    /* STATES */
    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    // current loans list
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
        id: false
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch all loans by client id
    const fetchLoansByClientId = async (clientId : string) => {
        setError(null);
        try {
            const loansData: LoanResponse = await getLoansByClientId(
                currentPage,
                pageSize,
                clientId
            );
            setLoans(loansData.items);
            setTotalPages(loansData.totalPages);
        } catch (err) {
            console.log(err);
            showErrorToast({ error, defaultMessage: "Error fetching loans by client id." });
        }
    }



    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        const handleDetail = (loan: Loan) => {
            console.log("Detail clicked", loan);
            // route to loan detail page
            navigate(`/loan/overview/${loan.id}`);
        }

        // Return generated columns
        return generateLoanOverviewColumns(handleDetail);
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
        // get client id from session storage
        const clientId = JSON.parse(sessionStorage.user).id;
        if(clientId == null){
            showErrorToast({defaultTitle: "Error", defaultMessage: "Client id is missing from session storage"});
        }
        fetchLoansByClientId(clientId);
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="p-6 space-y-4 font-paragraph">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
                <div className="flex flex-wrap gap-4 items-center">

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