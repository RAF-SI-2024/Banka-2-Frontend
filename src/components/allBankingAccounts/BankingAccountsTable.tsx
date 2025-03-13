import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AccountResponse, BankAccount } from "@/types/bankAccount.ts";
import { getAllAccounts, getAllCreditCardsForBankAccount  } from "@/api/bankAccount";
import {
    getCoreRowModel,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    flexRender,
    createColumnHelper,
    getExpandedRowModel,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/common/datatable/DataTablePagination";
import { DataTableViewOptions } from "@/components/common/datatable/DataTableViewOptions";
import { generateAccountColumns } from "./BankingAccountsColumnDef";
import {formatCurrency} from "@/utils/format-currency.ts";
import {Currency} from "@/types/currency.ts";
import CreditCardDropdownMenu from "@/components/allBankingAccounts/CreditCardDropdownMenu.tsx";

// Define credit card interface
interface CreditCard {
    id: string;
    number: string;
    name: string;
    limit: number;
    status: boolean;
}

export default function BankingAccountsTable() {
    // Your existing state variables
    const [search, setSearch] = useState({
        accountNumber: "",
        firstName: "",
        lastName: "",
    });
    const isSearchActive = Object.values(search).some(value => value !== "");
    const [fetchFlag, setFetchFlag] = useState(false);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [expanded, setExpanded] = useState({});

    const [cardsByAccount, setCardsByAccount] = useState<Record<string, { cards: CreditCard[], currency: Currency }>>({});

    const [loadingCards, setLoadingCards] = useState<Record<string, boolean>>({});

    // Fetch accounts function (existing)
    const fetchAccounts = async () => {
        console.log("Fetching accounts");
        setError(null);
        try {
            console.log("current page", currentPage);
            console.log("page size", pageSize);
            const accountsData: AccountResponse = await getAllAccounts(
                currentPage,
                pageSize,
                search
            );
            setAccounts(accountsData.items);
            setTotalPages(accountsData.totalPages);
            console.log(accountsData);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch accounts");
        }
    };

   const fetchCreditCards = async (account: BankAccount) => {
    if (cardsByAccount[account.id] || loadingCards[account.id]) return;

    setLoadingCards(prev => ({ ...prev, [account.id]: true }));
    try {
        const response = await getAllCreditCardsForBankAccount(account.id);
        setCardsByAccount(prev => ({
            ...prev,
            [account.id]: {
                cards: response.data?.items || [],
                currency: account.currency
            }
        }));
    } catch (err) {
        console.error("Failed to fetch credit cards:", err);
    } finally {
        setLoadingCards(prev => ({ ...prev, [account.id]: false }));
    }
};

    // Your existing handlers
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

    const updateAccountStatus = (id: string, newStatus: boolean) => {
        setAccounts((prevAccounts) =>
            prevAccounts.map((account) =>
                account.id === id ? { ...account, status: newStatus } : account
            )
        );
    };

    // Add expansion indicator to columns
    const columnHelper = createColumnHelper<BankAccount>();
    const columns = useMemo(() => {
        const baseColumns = generateAccountColumns(updateAccountStatus);

        return [
            columnHelper.display({
                id: 'expander',
                header: () => null,
                cell: ({ row }) => {
                    return (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                row.toggleExpanded();

                                // Fetch credit cards if expanding and not already loaded
                                if (!row.getIsExpanded() && !cardsByAccount[row.original.id] && !loadingCards[row.original.id]) {
                                    fetchCreditCards(row.original);
                                }
                            }}
                            className="p-0 h-8 w-8"
                        >
                            {row.getIsExpanded() ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    );
                },
            }),
            ...baseColumns,
        ];
    }, [cardsByAccount, loadingCards]);

    // Your table setup with expanded rows support
    const table = useReactTable({
        data: accounts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onExpandedChange: setExpanded,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            expanded,
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
            } else {
                const newPagination = updater;
                setCurrentPage(newPagination.pageIndex + 1);
                setPageSize(newPagination.pageSize);
            }
        },
        manualPagination: true,
        pageCount: totalPages,
    });

    useEffect(() => {
        fetchAccounts();
    }, [currentPage, pageSize, fetchFlag]);

    const handleCardStatusChange = (cardId: string, newStatus: boolean) => {
        // Find which account this card belongs to
        let targetAccountId = null;

        for (const [accountId, data] of Object.entries(cardsByAccount)) {
            const cardExists = data.cards.some(card => card.id === cardId);
            if (cardExists) {
                targetAccountId = accountId;
                break;
            }
        }

        if (targetAccountId) {
            // Update the card status in state
            setCardsByAccount(prev => {
                const accountData = prev[targetAccountId];
                const updatedCards = accountData.cards.map(card =>
                    card.id === cardId ? { ...card, status: newStatus } : card
                );

                return {
                    ...prev,
                    [targetAccountId]: {
                        ...accountData,
                        cards: updatedCards
                    }
                };
            });
        }
    };

    // TODO : needs refactoring to a new component/file
    const ExpandableDataTable = () => (
        <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                {table.getRowModel().rows.map((row) => (
                    <>
                        <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-4 align-middle">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                        {row.getIsExpanded() && (
                            <tr>
                                <td colSpan={row.getVisibleCells().length} className="p-0">
                                    <div className="p-4 pl-12 border-t border-b border-muted bg-muted/30">
                                        <h4 className="text-sm font-semibold mb-3">Credit Cards for Account {row.original.accountNumber}</h4>

                                        {loadingCards[row.original.id] ? (
                                            <div className="py-2 text-sm text-muted-foreground">Loading credit cards...</div>
                                        ) : cardsByAccount[row.original.id]?.cards?.length ? (
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-5 gap-4 text-xs font-medium text-muted-foreground pb-1">
                                                    <div>Card Number</div>
                                                    <div>Name</div>
                                                    <div>Limit</div>
                                                    <div>Status</div>
                                                    <div>Actions</div>
                                                </div>

                                                {cardsByAccount[row.original.id].cards.map((card) => (
                                                    <div key={card.id} className="grid grid-cols-5 gap-4 text-sm py-2 border-t border-muted items-center">
                                                        <div>{card.number.replace(/\d(?=\d{4})/g, "•")}</div>
                                                        <div>{card.name}</div>
                                                        <div>{formatCurrency(card.limit, cardsByAccount[row.original.id].currency.code)}</div>
                                                        <div>
                                                            <Badge variant={card.status ? "default" : "destructive"}>
                                                                {card.status ? "Active" : "Blocked"}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <CreditCardDropdownMenu
                                                                id={card.id}
                                                                status={card.status}
                                                                onStatusChange={handleCardStatusChange}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-2 text-sm text-muted-foreground">No credit cards found for this account</div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
                </tbody>
            </table>
        </div>
    );

    if (error)
        return (
            <h1 className="text-center text-2xl font-semibold text-destructive">
                {error}
            </h1>
        );

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

            <ExpandableDataTable />

            <DataTablePagination table={table} />
        </div>
    );
}