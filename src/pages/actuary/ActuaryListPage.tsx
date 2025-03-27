import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner.tsx";
import ActuaryTable from "@/components/actuary/ActuariesTable.tsx";

export default function ActuaryListPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <main className="flex flex-1 flex-col gap-4 pt-0">
      <Toaster richColors />
      <h1 className="font-display font-bold text-5xl">Actuaries</h1>
        <ActuaryTable/>
    </main>
  );
}
