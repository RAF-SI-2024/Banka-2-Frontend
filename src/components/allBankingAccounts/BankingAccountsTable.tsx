import { useState, useEffect, useMemo } from "react"
import { DataTable } from "@/components/common/datatable/DataTable.tsx"
import { getCoreRowModel } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/common/datatable/DataTablePagination"
import {
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { getAllAccounts } from "@/api/bankAccount"
import { Account, AccountResponse } from "@/types/bankAccount"
import { generateAccountColumns } from "./BankingAccountsColumnDef"

export default function BankingAccountsTable() {
  // States for search
  // isSearchActive - da znamo da li je clear button diseblovan
  // Clear/Filter button clicked

  const [accounts, setAccounts] = useState<Account[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [error, setError] = useState<string | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])

  // Column filters state

  // Visibility state - make some columns invisible by default
  // Nisam uradila jer ne znamo jos koje ce kolone sve biti
  /*const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  })*/

  const fetchAccounts = async () => {
    console.log("Fetching accounts")
    setError(null)
    try {
      const accountsData: AccountResponse = await getAllAccounts(
        currentPage,
        pageSize
        //, search
      )
      setAccounts(accountsData.items)
      setTotalPages(accountsData.totalPages)
      console.log(accountsData)
    } catch (err) {
      console.log(err)
      setError("Failed to fetch accounts")
    }
  }

  // Handle search change
  // Handle filter button click
  // Handle clear button in search

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
    // visibility i filters da se doda kad bude gotovo
    state: {
      sorting,
      // visibility i filters da se doda kad bude gotovo
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
  }, [currentPage, pageSize /*fetchFlag za search*/])

  if (error)
    return (
      <h1 className="text-center text-2xl font-semibold text-destructive">
        {error}
      </h1>
    )

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="w-full flex flex-row items-baseline">
        <p>Filteri i dugmici</p>
      </div>
      <DataTable key={`${currentPage}-${pageSize}`} table={table} />

      <DataTablePagination table={table} />
    </div>
  )
}
