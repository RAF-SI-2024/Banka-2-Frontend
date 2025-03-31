import { ColumnDef } from "@tanstack/react-table";
import { getTaxRoleString, Tax } from "@/types/tax.ts";
import TaxDropdownMenu from "@/components/tax/TaxDropdownMenu.tsx"; // prilagodi ako je putanja druga

export function generateTaxColumns(
    handleOpenEditDialog: (tax: Tax) => void,
    handleCollectClick: (tax: Tax) => void
): ColumnDef<Tax>[] {
    return [
        {
            accessorKey: "id",
            header: "Id",
            enableHiding: true,
        },
        {
            accessorKey: "firstName",
            header: "First Name",
            enableHiding: true,
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
            enableHiding: true,
        },
        {
            accessorKey: "email",
            header: "Email",
            enableHiding: true,
        },
        {
            accessorKey: "role",
            header: "Role",
            enableHiding: true,
            cell: ({ row }) => getTaxRoleString(row.original.role),
        },
        {
            accessorKey: "debt",
            header: "Debt",
            enableHiding: true,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TaxDropdownMenu
                    onCollect={() => handleCollectClick(row.original)}
                />
            ),
            enableHiding: false,
        },
    ];
}
