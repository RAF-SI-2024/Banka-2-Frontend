import { useMemo, useState } from "react";
import { DataTable } from "@/components/__common__/datatable/DataTable.tsx";
import { mockActuariesData } from "@/api/actuary.ts";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTablePagination } from "../__common__/datatable/DataTablePagination";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "../__common__/datatable/DataTableViewOptions";
import { Actuary } from "@/types/actuary";
import UserDropdownMenu from "../user-table/all-users/UserDropdownMenu";

export default function ActuariesTable() {
  const [search, setSearch] = useState({
    email: "",
    firstName: "",
    lastName: "",
    actuaryType: "",
  });

  // Definišemo kolone
  const columns = useMemo(
    () => [
      { accessorKey: "email", header: "Email" },
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "actuaryType", header: "Actuary Type" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({}) => (
          <UserDropdownMenu
            onEdit={function (): void {
              throw new Error("Function not implemented.");
            }}
            onDelete={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      },
    ],
    []
  );
  // Funkcija za edit
  const handleEdit = (rowData: any) => {
    console.log("Editing row:", rowData);
  };

  // Clear/Filter button clicked
  const [fetchFlag, setFetchFlag] = useState(false);

  // edit
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isSearchActive = Object.values(search).some((value) => value !== "");

  const filteredData = useMemo(() => {
    return mockActuariesData.filter((row) => {
      return (
        row.email.toLowerCase().includes(search.email.toLowerCase()) &&
        row.firstName.toLowerCase().includes(search.firstName.toLowerCase()) &&
        row.lastName.toLowerCase().includes(search.lastName.toLowerCase()) &&
        (search.actuaryType ? row.actuaryType === search.actuaryType : true)
      );
    });
  }, [search, fetchFlag]); // Re-evaluates when search changes

  /* FUNCTIONS */

  // handle search change
  const handleSearchChange = (field: string, value: string) => {
    setSearch((prevSearch) => ({ ...prevSearch, [field]: value }));
  };

  // Kreiramo tabelu
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // handle filter button click
  const handleFilter = () => {
    {
      console.log("");
    }
    setFetchFlag(!fetchFlag);
  };

  // handle clear button in search
  const handleClearSearch = async () => {
    console.log("Clearing search...");
    // Reset search and fetch immediately
    setSearch({
      email: "",
      firstName: "",
      lastName: "",
      actuaryType: "",
    });
    setFetchFlag(!fetchFlag);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="w-full flex flex-row items-baseline">
        {/* 🔍 Search Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Filter by email"
            value={search.email}
            onChange={(e) => handleSearchChange("email", e.target.value)}
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

          <Select
            onValueChange={(value) => handleSearchChange("actuaryType", value)}
            value={search.actuaryType}
          >
            <SelectTrigger className="w-42">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Supervisor</SelectItem>
              <SelectItem value="2">Agent</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Button onClick={handleFilter} variant="primary">
              <span className="icon-[ph--funnel]" />
              Filter
            </Button>
            <Button
              onClick={handleClearSearch}
              variant="secondary"
              disabled={!isSearchActive}
            >
              <span className="icon-[ph--funnel-x]" />
              Clear
            </Button>
          </div>
        </div>
        <div className="flex ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
}
