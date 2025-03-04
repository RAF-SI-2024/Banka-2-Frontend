import { Account } from "@/types/bankAccount"
import { ColumnDef } from "@tanstack/react-table"
import BankingAccountDropdownMenu from "./BankingAccountDropdownMenu"

export function generateAccountColumns(): ColumnDef<Account>[] {
  return [
    {
      accessorKey: "number",
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
      header: "Ownership",
    },
    {
      accessorKey: "type.description",
      header: "Type",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => <BankingAccountDropdownMenu />,
      enableHiding: false,
    },
  ]
}
