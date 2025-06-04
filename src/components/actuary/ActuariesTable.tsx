import { useEffect, useMemo, useState } from "react";
import { Actuary } from "@/types/bank_user/actuary.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/__common__/datatable/DataTable";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination";
import { DataTableViewOptions } from "@/components/__common__/datatable/DataTableViewOptions";
import { actuariesMock } from "@/__mocks/ActuariesMock.ts";
import { generateActuaryColumns } from "@/components/actuary/ActuariesListColumnDef.tsx";
import { EditActuaryDialog } from "@/components/actuary/edit-actuary/EditActuaryDialog.tsx";
import ResetLimitConfirmDialog from "./reset-used-limit/ResetLimitConfirmDialog";
import { User } from "@/types/bank_user/user.ts";
import { getAllUsers } from "@/api/bank_user/user.ts";

export default function ActuaryTable() {
  const [actuaries, setActuaries] = useState<Actuary[]>([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [selectedActuary, setSelectedActuary] = useState<Actuary | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isResetLimitDialogOpen, setResetLimitDialogOpen] = useState(false);

  const [search, setSearch] = useState({
    email: "",
    firstName: "",
    lastName: "",
    actuaryType: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    email: "",
    firstName: "",
    lastName: "",
    actuaryType: "",
  });

  const handleApplyFilters = () => {
    setAppliedFilters(search);
  };

  const isSearchActive = Object.values(search).some((v) => v !== "");

  const handleSearchChange = (field: string, value: string) => {
    setSearch((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearSearch = () => {
    setSearch({
      email: "",
      firstName: "",
      lastName: "",
      actuaryType: "",
    });
    setAppliedFilters({
      email: "",
      firstName: "",
      lastName: "",
      actuaryType: "",
    });
    setFetchFlag(!fetchFlag);
  };

  const handleEdit = (actuary?: Actuary) => {
    if (!actuary) return;
    setSelectedActuary(actuary);
    setDialogOpen(true);
  };

  const handleResetLimit = (actuary: Actuary) => {
    console.log("Reset limit:", actuary);
    setSelectedActuary(actuary);
    setResetLimitDialogOpen(true);
  };

  const handleActuaryUpdate = (updatedActuary: Actuary) => {
    setActuaries((prevActuaries) =>
      prevActuaries.map((actuary) =>
        actuary.id === updatedActuary.id ? updatedActuary : actuary
      )
    );
  };

  const columns = useMemo(
    () => generateActuaryColumns(handleEdit, handleResetLimit, users),
    [users]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filteredData = useMemo(() => {
    return actuaries.filter((a) => {
      const matchesEmail = a.email
        .toLowerCase()
        .includes(search.email.toLowerCase());
      const matchesFirst = a.firstName
        .toLowerCase()
        .includes(search.firstName.toLowerCase());
      const matchesLast = a.lastName
        .toLowerCase()
        .includes(search.lastName.toLowerCase());
      const matchesType =
        search.actuaryType === "" ||
        a.actuaryType === parseInt(appliedFilters.actuaryType);
      return matchesEmail && matchesFirst && matchesLast && matchesType;
    });
  }, [actuaries, appliedFilters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  useEffect(() => {
    setActuaries(actuariesMock);
  }, [fetchFlag]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userResponse = await getAllUsers(1, 1000, {});
        setUsers(userResponse.items);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleConfirmResetLimit = () => {
    if (selectedActuary) {
      const updatedActuary = { ...selectedActuary, usedLimit: 0 };

      setActuaries((prevActuaries) =>
        prevActuaries.map((actuary) =>
          actuary.id === updatedActuary.id ? updatedActuary : actuary
        )
      );

      console.log("Limit reset for actuary:", selectedActuary);
    }
    setResetLimitDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="w-full flex flex-row items-baseline">
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Filter by email"
            value={search.email}
            onChange={(e) => handleSearchChange("email", e.target.value)}
            className="w-88"
          />
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
          <Select
            value={search.actuaryType}
            onValueChange={(value) => handleSearchChange("actuaryType", value)}
          >
            <SelectTrigger className="w-42">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Supervisor</SelectItem>
              <SelectItem value="2">Agent</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Button variant="primary" onClick={handleApplyFilters}>
              <span className="icon-[ph--funnel]" /> Filter
            </Button>
            <Button variant="secondary" onClick={handleClearSearch}>
              <span className="icon-[ph--funnel-x]" /> Clear
            </Button>
          </div>
        </div>

        <div className="flex ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <DataTable table={table} />
      <DataTablePagination table={table} />

      {selectedActuary && (
        <EditActuaryDialog
          actuary={selectedActuary}
          isOpen={isDialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleActuaryUpdate}
        />
      )}

      {selectedActuary && (
        <ResetLimitConfirmDialog
          open={isResetLimitDialogOpen}
          onClose={() => setResetLimitDialogOpen(false)}
          onConfirm={handleConfirmResetLimit}
        />
      )}
    </div>
  );
}
