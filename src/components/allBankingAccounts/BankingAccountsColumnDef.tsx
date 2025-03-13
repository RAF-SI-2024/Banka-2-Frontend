import { BankAccount } from "@/types/bankAccount"
import { ColumnDef } from "@tanstack/react-table"
import BankingAccountDropdownMenu from "./BankingAccountDropdownMenu"
import {Badge} from "@/components/ui/badge.tsx";

export function generateAccountColumns(
    updateAccountStatus: (id: string, newStatus: boolean) => void
): ColumnDef<BankAccount>[] {
  return [
    {
      accessorKey: "accountNumber",
      header: "Bank Account Number",
      enableHiding: true,
    },
    {
      accessorKey: "client.firstName",
      header: "First Name",
    },
    {
      accessorKey: "client.lastName",
      header: "Last Name",
    },
    {
      accessorKey: "type.name",
      header: "Type",
    },
    {
      accessorKey: "activated",
      header: "Status",
      cell: ({row}) => (
          <Badge variant={row.original.status ? "default" : "destructive"}>
            {row.original.status ? "Active" : "Blocked"}
          </Badge>
      ),
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
          <BankingAccountDropdownMenu
              id={row.original.id}
              status={row.original.status}
              onStatusChange={updateAccountStatus}
          />
      ),
      enableHiding: false,
    },
  ]
}
