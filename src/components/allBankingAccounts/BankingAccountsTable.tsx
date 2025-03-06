import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Account, AccountResponse } from "@/types/bankAccount"
import { getAllAccounts } from "@/api/bankAccount"
import { DataTable } from "@/components/common/datatable/DataTable.tsx"
import { getCoreRowModel } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/common/datatable/DataTablePagination"
import { DataTableViewOptions } from "@/components/common/datatable/DataTableViewOptions";
import {
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { generateAccountColumns } from "./BankingAccountsColumnDef"


export default function BankingAccountsTable() {
  const [search, setSearch] = useState({
    accountNumber: "",
    firstName: "",
    lastName: "",
});
  // Edit missing

  const isSearchActive = Object.values(search).some(value => value !== "");

  const [fetchFlag, setFetchFlag] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [error, setError] = useState<string | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])

  // Not done because we still dont know which columns there will be
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
      
    });

   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const fetchAccounts = async () => {
    console.log("Fetching accounts")
    setError(null)
    try {
      const accountsData: AccountResponse = await getAllAccounts(
        currentPage,
        pageSize,
        search
      )
      setAccounts(accountsData.items)
      setTotalPages(accountsData.totalPages)
      console.log(accountsData)
    } catch (err) {
      console.log(err)
      setError("Failed to fetch accounts")
    }
  }

  const handleSearchChange = (field: string, value: string) => {
    setSearch(prevSearch => ({ ...prevSearch, [field]: value }));
  };

  const handleFilter = () => {
        setFetchFlag(!fetchFlag);
    };

  const handleClearSearch = async () => {
    console.log("Clearing search...");
    setSearch({
        accountNumber: "",
        firstName: "",
        lastName: "",
    });
    setFetchFlag(!fetchFlag);
  };

  const columns = useMemo(() => {
    return generateAccountColumns()
  }, [])

  const table = useReactTable({
    data: accounts,
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
        const newPagination = updater(table.getState().pagination)
        setCurrentPage(newPagination.pageIndex + 1)
        setPageSize(newPagination.pageSize)
      } else {
        const newPagination = updater
        setCurrentPage(newPagination.pageIndex + 1)
        setPageSize(newPagination.pageSize)
      }
    },
    manualPagination: true,
    pageCount: totalPages,
  })

  useEffect(() => {
    fetchAccounts()
  }, [currentPage, pageSize, fetchFlag])

  if (error)
    return (
      <h1 className="text-center text-2xl font-semibold text-destructive">
        {error}
      </h1>
    )

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="w-full flex flex-row items-baseline">
                <div className="flex flex-wrap gap-4 items-center">

                    <Input
                        placeholder="Filter by accounts"
                        value={search.accountNumber}
                        onChange={(e) => handleSearchChange("accountNumber", e.target.value)}
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
                {<div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>}
            </div>
      <DataTable key={`${currentPage}-${pageSize}`} table={table} />

      <DataTablePagination table={table} />
    </div>
  )
}
