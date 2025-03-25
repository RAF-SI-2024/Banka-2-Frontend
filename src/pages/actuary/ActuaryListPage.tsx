import UserTable from "@/components/user-table/all-users/UserTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import React, { useState } from "react";
import RegisterDialog from "@/components/register/RegisterDialog.tsx";
import { Role } from "@/types/user.ts";
import { Toaster } from "@/components/ui/sonner.tsx";
import ActuariesTable from "@/components/actuary/ActuariesTable";

export default function ActuaryListPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <main className="flex flex-1 flex-col gap-4 pt-0">
      <Toaster richColors />
      <h1 className="font-display font-bold text-5xl">Actuaries</h1>
      <ActuariesTable />
    </main>
  );
}
