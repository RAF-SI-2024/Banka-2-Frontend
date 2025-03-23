import {useState, useEffect, useMemo} from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { User, UserResponse } from "@/types/user.ts";
import {getAllClients} from "@/api/user.ts";
import { EditUserDialog } from "@/components/user-table/all-users/edit-user/EditUserDialog.tsx";
import { DataTable } from "@/components/__common__/datatable/DataTable.tsx";
import { getCoreRowModel} from "@tanstack/react-table";
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
import {generateClientColumns} from "./ClientListColumnDef.tsx";


export default function UserTable() {
    /* STATES */
    const [search, setSearch] = useState({
        email: "",
        firstName: "",
        lastName: "",
    });
    // edit
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // search active - to display clear button
    const isSearchActive = Object.values(search).some(value => value !== "");

    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    // current user list
    const [clients, setClients] = useState<User[]>([]);

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
        uniqueIdentificationNumber: false,
        gender: false,
        phoneNumber: false,
        address: false,
        department: false
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch clients function
    const fetchClients = async () => {
        console.log("Fetching clients");
        setError(null);
        try {
            const clientData: UserResponse = await getAllClients(
                currentPage,
                pageSize,
                search
            );
            setClients(clientData.items);
            setTotalPages(clientData.totalPages);
            console.log(clientData)
        } catch (err) {
            console.log(err);
            setError("Failed to fetch clients");
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
            email: "",
            firstName: "",
            lastName: "",
        });
        setFetchFlag(!fetchFlag);
    };

    /* TABLE */
    // generate columns
    const columns = useMemo(() => {
        // Define handleOpenEditDialog inside useMemo
        const handleOpenEditDialog = (user: User) => {
            setEditingUser(user);
            setIsEditDialogOpen(true);
        };


        return generateClientColumns(handleOpenEditDialog);
    }, []);

    // create the table instance with pagination, sorting, and column visibility
    const table = useReactTable({
        data: clients,
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
            if (typeof updater === "function") {
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

    // fetch clients effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        fetchClients();
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (
        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
                <div className="flex flex-wrap gap-4 items-center">

                    <Input
                        placeholder="Filter by email"
                        value={search.email}
                        onChange={(e) => handleSearchChange("email", e.target.value)}
                        className="w-88"
                    />

                    <div className="flex flex-row gap-4">
                        <Input
                            placeholder="Filter by first name"
                            value={search.firstName}
                            onChange={(e) => handleSearchChange("firstName", e.target.value)}
                            className="w-42"
                        />
                        <Input
                            placeholder="Filter by last name"
                            value={search.lastName}
                            onChange={(e) => handleSearchChange("lastName", e.target.value)}
                            className="w-42"
                        />
                    </div>

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

            {/* 📋 Client Table */}
            <DataTable
                key={`${currentPage}-${pageSize}`} // Re-render on pagination changes
                table={table}
            />


            {/* Pagination Controls */}
            <DataTablePagination table={table} />

            {/* User editing dialog show */}
            {editingUser && (
                <EditUserDialog
                    id={editingUser.id}
                    isOpen={isEditDialogOpen}
                    onOpenChange={(open: boolean) => {
                        setIsEditDialogOpen(open);
                        if (!open) {
                            setEditingUser(null);
                            setFetchFlag(!fetchFlag);
                        }
                    }}
                />
            )}
        </div>
    );
}