import { ColumnDef } from "@tanstack/react-table";
import { Actuary, Permission, getActuaryTypeLabel } from "@/types/bank_user/actuary.ts";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency.ts";
import ActuariesDropdownMenu from "@/pages/actuary/ActuaryDropDownMenu.tsx";
import {Role, User} from "@/types/bank_user/user.ts";
import {getUserById} from "@/api/bank_user/user.ts";

export function generateActuaryColumns(
  handleOpenEditDialog: (actuary: Actuary) => void,
  // handleResetUsedLimit: (actuary: Actuary) => void,
  users: Actuary[]
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
      cell: ({ row }) => getActuaryTypeLabel(row.original.permission),
    },
    {
      accessorKey: "limit",
      header: "Limit",
      cell: ({ row }) => formatCurrency(row.original.account.monthlyLimit, "RSD"),
    },
    // {
    //   accessorKey: "usedLimit",
    //   header: "Used Limit",
    //   cell: ({ row }) => formatCurrency(row.original.usedLimit, "RSD"),
    // },
    // {
    //   accessorKey: "needsApproval",
    //   header: "Needs Approval",
    //   cell: ({ row }) => (
    //     // nisam sigurna za boje proveriti boje!!
    //     <Badge variant={row.original.permission ? "destructive" : "success"}>
    //       {row.original.permission ? "Yes" : "No"}
    //     </Badge>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {

        const actuary = row.original;
        const userRole = actuary.role ?? Role.Employee;

        return (
            <ActuariesDropdownMenu
                actuary={actuary}
                currentUserRole={userRole}
                onEdit={() => handleOpenEditDialog(actuary)}
                // onResetLimit={() => handleResetUsedLimit(actuary)}
            />
        );
      },
    },
  ];
}
