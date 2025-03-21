import React from "react";
import { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BankAccount } from "@/types/bankAccount.ts";
import { formatCurrency } from "@/utils/format-currency.ts";
import CreditCardDropdownMenu from "@/components/allBankingAccounts/CreditCardDropdownMenu.tsx";

// Define credit card interface
interface CreditCard {
    id: string;
    number: string;
    name: string;
    limit: number;
    status: boolean;
}

interface ExpandableDataTableProps {
    table: Table<BankAccount>;
    cardsByAccount: Record<string, { cards: CreditCard[], currency: any }>;
    loadingCards: Record<string, boolean>;
    handleCardStatusChange: (cardId: string, newStatus: boolean) => void;
    fetchCreditCards: (account: BankAccount) => void;
}

export const ExpandableDataTable: React.FC<ExpandableDataTableProps> = ({
    table,
    cardsByAccount,
    loadingCards,
    handleCardStatusChange,
    fetchCreditCards
}) => {
    return (
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
                    <React.Fragment key={row.id}>
                        <tr
                            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                                row.toggleExpanded();

                                // Fetch credit cards if expanding and not already loaded
                                if (!row.getIsExpanded() && !cardsByAccount[row.original.id] && !loadingCards[row.original.id]) {
                                    fetchCreditCards(row.original);
                                }
                            }}
                        >
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
                                        <h4 className="text-sm font-semibold mb-3">Credit Cards for
                                            Account {row.original.accountNumber}</h4>

                                        {loadingCards[row.original.id] ? (
                                            <div className="py-2 text-sm text-muted-foreground">Loading credit
                                                cards...</div>
                                        ) : cardsByAccount[row.original.id]?.cards?.length ? (
                                            <div className="space-y-2">
                                                <div
                                                    className="grid grid-cols-5 gap-4 text-xs font-medium text-muted-foreground pb-1">
                                                    <div>Card Number</div>
                                                    <div>Name</div>
                                                    <div>Limit</div>
                                                    <div>Status</div>
                                                    <div>Actions</div>
                                                </div>

                                                {cardsByAccount[row.original.id].cards.map((card) => (
                                                    <div key={card.id}
                                                         className="grid grid-cols-5 gap-4 text-sm py-2 border-t border-muted items-center">
                                                        <div>{card.number.replace(/\d(?=\d{4})/g, "•")}</div>
                                                        <div>{card.name}</div>
                                                        <div>{formatCurrency(card.limit, cardsByAccount[row.original.id].currency.code)}</div>
                                                        <div>
                                                            <Badge variant={card.status ? "success" : "destructive"}>
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
                                            <div className="py-2 text-sm text-muted-foreground">No credit cards found
                                                for this account</div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};