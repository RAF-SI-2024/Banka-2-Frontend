import {useEffect, useMemo, useState} from "react";
import {Actuary, EditActuaryRequest, Permission} from "@/types/bank_user/actuary.ts";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {DataTable} from "@/components/__common__/datatable/DataTable";
import {DataTablePagination} from "@/components/__common__/datatable/DataTablePagination";
import {DataTableViewOptions} from "@/components/__common__/datatable/DataTableViewOptions";
import {generateActuaryColumns} from "@/components/actuary/ActuariesListColumnDef.tsx";
import {EditActuaryDialog} from "@/components/actuary/edit-actuary/EditActuaryDialog.tsx";
import ResetLimitConfirmDialog from "./reset-used-limit/ResetLimitConfirmDialog";
import {User, UserResponse} from "@/types/bank_user/user.ts";
import {getAllUsers} from "@/api/bank_user/user.ts";
import {editAccountClient, getAccountById} from "@/api/bank_user/bank-account.ts";
import {BankAccount} from "@/types/bank_user/bank-account.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";
import {editPermission} from "@/api/bank_user/actuary.ts";

export default function ActuaryTable() {
  const [actuaries, setActuaries] = useState<Actuary[]>([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [selectedActuary, setSelectedActuary] = useState<Actuary | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isResetLimitDialogOpen, setResetLimitDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState({
    email: "",
    firstName: "",
    lastName: "",
    permissions: "8"
  });



  const handleSearchChange = (field: string, value: string) => {
    setSearch((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearSearch = () => {
    setSearch({
      email: "",
      firstName: "",
      lastName: "",
      permissions: "8"
    });
    setFetchFlag(!fetchFlag);
  };

  const handleEdit = (actuary?: Actuary) => {
    if (!actuary) return;
    setSelectedActuary(actuary);
    setDialogOpen(true);
  };

  // const handleResetLimit = (actuary: Actuary) => {
  //   console.log("Reset limit:", actuary);
  //   setSelectedActuary(actuary);
  //   setResetLimitDialogOpen(true);
  // };

  const columns = useMemo(
      () => generateActuaryColumns(handleEdit, actuaries),
      [actuaries]
  );

  const handleActuaryUpdate = (updatedActuary: Actuary) => {
    setActuaries((prevActuaries) =>
      prevActuaries.map((actuary) =>
        actuary.id === updatedActuary.id ? updatedActuary : actuary
      )
    );
  };

  const fetchActuaries = async () => {
    setError(null);
    try {
      const usersData: UserResponse = await getAllUsers(
          currentPage,
          pageSize,
          search,
      );
      const actuariesData: Actuary[] = await Promise.all(
          usersData.items.map(async (user) => {
            const account: BankAccount = (await getAccountById(user.accounts[0].id)).data;
            return {
              id: user.id,
              email: user.email,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              permission: user.permissions,
              account: account,
              role: user.role,
            };
          })
      );
      setActuaries(actuariesData);
      setTotalPages(usersData.totalPages);
    } catch (err) {
      setError("Failed to fetch actuaries");
    }
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});



  const table = useReactTable({
    data: actuaries,
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
    fetchActuaries();
  }, [fetchFlag]);

  const handleFilter = () => {
    setCurrentPage(1);
    setFetchFlag(!fetchFlag);
  };


  // const handleConfirmResetLimit = () => {
  //   if (selectedActuary) {
  //     const updatedActuary = { ...selectedActuary, usedLimit: 0 };
  //
  //     setActuaries((prevActuaries) =>
  //       prevActuaries.map((actuary) =>
  //         actuary.id === updatedActuary.id ? updatedActuary : actuary
  //       )
  //     );
  //
  //     console.log("Limit reset for actuary:", selectedActuary);
  //   }
  //   setResetLimitDialogOpen(false);
  // };

  async function onEditActuary(oldValue: Actuary, req: EditActuaryRequest) {
    try{
      if(oldValue.permission !== req.permission){
        console.log(req.permission);
        await editPermission(oldValue.id, oldValue.permission, req.permission);
      }
      if(oldValue.account.monthlyLimit !== req.accountLimit){
         await editAccountClient(oldValue.account.id, {dailyLimit: oldValue.account.dailyLimit, monthlyLimit: req.accountLimit, name: oldValue.account.name.replace(" ", "")} );
      }


      showSuccessToast({description: "Actuary successfully edited"});

      setFetchFlag(!fetchFlag);
    }
    catch (err){
      showErrorToast({defaultMessage:"Error editing actuary", error:err})
      console.error(err)
    }
  }

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
          {/*<Select*/}
          {/*  value={search.permissions}*/}
          {/*  onValueChange={(value) => handleSearchChange("permissions", value)}*/}
          {/*>*/}
          {/*  <SelectTrigger className="w-42">*/}
          {/*    <SelectValue placeholder="Filter by type" />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    <SelectItem value={Permission.Supervisor.toString()}>Supervisor</SelectItem>*/}
          {/*    <SelectItem value={Permission.Agent.toString()}>Agent</SelectItem>*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}

          <div className="flex items-center space-x-2">
            <Button variant="primary" onClick={handleFilter}>
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
          onEditActuary={onEditActuary}
        />
      )}

      {/*{selectedActuary && (*/}
      {/*  <ResetLimitConfirmDialog*/}
      {/*    open={isResetLimitDialogOpen}*/}
      {/*    onClose={() => setResetLimitDialogOpen(false)}*/}
      {/*    onConfirm={handleConfirmResetLimit}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
}
