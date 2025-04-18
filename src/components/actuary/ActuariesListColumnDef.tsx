import { ColumnDef } from "@tanstack/react-table";
import { Actuary, ActuaryType, getActuaryTypeLabel } from "@/types/bank_user/actuary.ts";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency.ts";
import ActuariesDropdownMenu from "@/pages/actuary/ActuaryDropDownMenu.tsx";
import {Role, User} from "@/types/bank_user/user.ts";
import {getUserById} from "@/api/bank_user/user.ts";

export function generateActuaryColumns(
  handleOpenEditDialog: (actuary: Actuary) => void,
  handleResetUsedLimit: (actuary: Actuary) => void,
  users: User[]
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
        // nisam sigurna za boje proveriti boje!!
        <Badge variant={row.original.needsApproval ? "destructive" : "success"}>
          {row.original.needsApproval ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {

        const actuary = row.original;
        const userForActuary = users.find((u) => u.id === actuary.employeeId);
        const userRole = userForActuary?.role ?? Role.Employee;

        return (
            <ActuariesDropdownMenu
                actuary={actuary}
                currentUserRole={userRole}
                onEdit={() => handleOpenEditDialog(actuary)}
                onResetLimit={() => handleResetUsedLimit(actuary)}
            />
        );
      },
    },
  ];
}
