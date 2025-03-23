import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AccountResponse, BankAccount } from "@/types/bankAccount.ts";
import { getAllAccounts, getAllCreditCardsForBankAccount } from "@/api/bankAccount.ts";
import {
    getCoreRowModel,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    createColumnHelper,
    getExpandedRowModel,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination.tsx";
import { DataTableViewOptions } from "@/components/__common__/datatable/DataTableViewOptions.tsx";
import { generateAccountColumns } from "./BankingAccountsColumnDef.tsx";
import {Currency} from "@/types/currency.ts";
import {ExpandableDataTable} from "@/components/bank-account/bank-account-table/ExpandableDataTable.tsx";

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
        setError(null);
        try {
            const accountsData: AccountResponse = await getAllAccounts(
                currentPage,
                pageSize,
                search
            );
            setAccounts(accountsData.items);
            setTotalPages(accountsData.totalPages);
        } catch (err) {
            setError("Failed to fetch accounts");
        }
    };

    const fetchCreditCards = async (account: BankAccount) => {
        if (cardsByAccount[account.id] || loadingCards[account.id])
            return;

        setLoadingCards(prev => ({ ...prev, [account.id]: true }));
        try {
            const response = await getAllCreditCardsForBankAccount(account.id);
            if (response) {
                setCardsByAccount(prev => ({
                    ...prev,
                    [account.id]: {
                        cards: response.data?.items || [],
                        currency: account.currency
                    }
                }));
            } else {
                console.error("Response is undefined");
            }
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

    // Handle row expansion
    const handleRowClick = (row: any) => {
        fetchCreditCards(row.original);
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
                        <div className="p-0 h-4 w-4">
                            {row.getIsExpanded() ? (
                                <span className="icon-[ph--caret-down]"></span>
                            ) : (
                                <span className="icon-[ph--caret-right]"></span>
                            )}
                        </div>
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
        meta: {
            handleRowClick, // Pass the handler to the table meta
        },
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

            <ExpandableDataTable
                table={table}
                cardsByAccount={cardsByAccount}
                loadingCards={loadingCards}
                handleCardStatusChange={handleCardStatusChange}
                fetchCreditCards={fetchCreditCards}
            />

            <DataTablePagination table={table} />
        </div>
    );
}