import {useState, useEffect, useMemo} from "react";
import { DataTable } from "@/components/__common__/datatable/DataTable.tsx";
import { getCoreRowModel} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination";
import {
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import {Installment, InstallmentResponsePage} from "@/types/loan.ts";
import {getLoanInstallments} from "@/api/loan.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";
import {generateInstallmentColumns} from "@/components/loans/loan-details/InstallmentTableColumnDef.tsx";
import { DataTableViewOptions } from "@/components/__common__/datatable/DataTableViewOptions";

interface InstallmentTableProps {
    loanId: string;
}

export default function InstallmentTable({loanId}:InstallmentTableProps) {
    /* STATES */
    // const [search, ] = useState({
    //     email: "",
    //     firstName: "",
    //     lastName: "",
    //     role: "",
    // });
    // edit
    // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    // const [editingUser, setEditingUser] = useState<User | null>(null);

    // search active - to display clear button
    // const isSearchActive = Object.values(search).some(value => value !== "");

    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    // current user list
    const [installments, setInstallments] = useState<Installment[]>([]);

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
        // id: false,
        // dateOfBirth: false,
        // uniqueIdentificationNumber: false,
        // gender: false,
        // phoneNumber: false,
        // address: false,
        // department: false
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch users function
    const fetchInstallments = async () => {
        console.log("Fetching installments");
        setError(null);
        try {
            const data: InstallmentResponsePage = await getLoanInstallments(
                loanId,
                currentPage,
                pageSize,
                // search
            );
            setInstallments(data.items);
            setTotalPages(data.totalPages);
            console.log(data)
        } catch (err) {
            showErrorToast({error:err, defaultMessage: "Failed to fetch installments."});
            setError("Failed to fetch installments");
        }
    };

    // handle search change
    // const handleSearchChange = (field: string, value: string) => {
    //     setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
    // };

    // handle filter button click
    // const handleFilter = () => {
    //     setFetchFlag(!fetchFlag);
    // };

    // handle clear button in search
    // const handleClearSearch = async () => {
    //     console.log("Clearing search...");
    //     // Reset search and fetch immediately
    //     setSearch({
    //         email: "",
    //         firstName: "",
    //         lastName: "",
    //         role: "",
    //     });
    //     setFetchFlag(!fetchFlag);
    // };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        // Define handleOpenEditDialog inside useMemo
        // const handleOpenEditDialog = (user: User) => {
        //     setEditingUser(user);
        //     setIsEditDialogOpen(true);
        // };

        // Return generated columns
        return generateInstallmentColumns();
    }, []); // Empty dependency array since handleOpenEditDialog is now inside

    // create the table instance with pagination, sorting, and column visibility
    const table = useReactTable({
        data: installments,
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
        fetchInstallments();
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
            {/*    <div className="flex flex-wrap gap-4 items-center">*/}

            {/*        <Input*/}
            {/*            placeholder="Filter by email"*/}
            {/*            value={search.email}*/}
            {/*            onChange={(e) => handleSearchChange("email", e.target.value)}*/}
            {/*            className="w-88"*/}
            {/*        />*/}

            {/*        <div className="flex flex-row gap-4">*/}
            {/*            <Input*/}
            {/*                placeholder="Filter by first name"*/}
            {/*                value={search.firstName}*/}
            {/*                onChange={(e) => handleSearchChange("firstName", e.target.value)}*/}
            {/*                className="w-42"*/}
            {/*            />*/}
            {/*            <Input*/}
            {/*                placeholder="Filter by last name"*/}
            {/*                value={search.lastName}*/}
            {/*                onChange={(e) => handleSearchChange("lastName", e.target.value)}*/}
            {/*                className="w-42"*/}
            {/*            />*/}
            {/*        </div>*/}

            {/*        <Select onValueChange={(value) => handleSearchChange("role", value)} value={search.role}>*/}
            {/*            <SelectTrigger className="w-42">*/}
            {/*                <SelectValue placeholder="Filter by role" />*/}
            {/*            </SelectTrigger>*/}
            {/*            <SelectContent>*/}
            {/*                <SelectItem value="1">Admin</SelectItem>*/}
            {/*                <SelectItem value="2">Employee</SelectItem>*/}
            {/*                <SelectItem value="3">Client</SelectItem>*/}
            {/*            </SelectContent>*/}
            {/*        </Select>*/}


            {/*        <div className="flex items-center space-x-2">*/}
            {/*            <Button onClick={handleFilter} variant="primary">*/}
            {/*                <span className="icon-[ph--funnel]" />*/}
            {/*                Filter*/}
            {/*            </Button>*/}
            {/*            <Button onClick={handleClearSearch} variant="secondary" disabled={!isSearchActive}>*/}
            {/*                <span className="icon-[ph--funnel-x]" />*/}
            {/*                Clear*/}
            {/*            </Button>*/}

            {/*        </div>*/}
            {/*    </div>*/}
                <div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            {/* 📋 Users Table */}

            <DataTable
                key={`${currentPage}-${pageSize}`} // Re-render on pagination changes
                table={table}
            />


            {/* Pagination Controls */}
            <DataTablePagination table={table} />

            {/* User editing dialog show */}
            {/*{editingUser && (*/}
            {/*    <EditUserDialog*/}
            {/*        id={editingUser.id}*/}
            {/*        isOpen={isEditDialogOpen}*/}
            {/*        onOpenChange={(open: boolean) => {*/}
            {/*            setIsEditDialogOpen(open);*/}
            {/*            if (!open) {*/}
            {/*                setEditingUser(null);*/}
            {/*                setFetchFlag(!fetchFlag);*/}
            {/*            }*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}