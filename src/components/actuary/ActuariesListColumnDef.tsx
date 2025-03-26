import { ColumnDef } from "@tanstack/react-table";
import { Actuary, ActuaryType, getActuaryTypeLabel } from "@/types/actuary";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency.ts";
import ActuariesDropdownMenu from "@/pages/actuary/ActuaryDropDownMenu.tsx";

export function generateActuaryColumns(
  handleOpenEditDialog: (actuary: Actuary) => void,
  handleResetUsedLimit: (actuary: Actuary) => void
): ColumnDef<Actuary>[] {
  return [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "actuaryType",
      header: "Actuary Type",
      cell: ({ row }) => getActuaryTypeLabel(row.original.actuaryType),
    },
    {
      accessorKey: "limit",
      header: "Limit",
      cell: ({ row }) => formatCurrency(row.original.limit, "RSD"),
    },
    {
      accessorKey: "usedLimit",
      header: "Used Limit",
      cell: ({ row }) => formatCurrency(row.original.usedLimit, "RSD"),
    },
    {
      accessorKey: "needsApproval",
      header: "Needs Approval",
      cell: ({ row }) => (
        // nisam sigurna za boje proveriti!!
        <Badge variant={row.original.needsApproval ? "success" : "destructive"}>
          {row.original.needsApproval ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActuariesDropdownMenu
          actuary={row.original}
          onEdit={() => handleOpenEditDialog(row.original)}
          onResetLimit={() => handleResetUsedLimit(row.original)}
        />
      ),
    },
  ];
}
