import {Toaster} from "@/components/ui/sonner.tsx";
import ClientTable from "@/components/user-table/clients/ClientTable.tsx";
import React from "react";

export default function ClientList() {
    return (
        <main className="flex flex-1 flex-col gap-4 pt-0">
            <Toaster richColors />
            <h1 className="font-display font-bold text-5xl">Client list</h1>
            <ClientTable/>
        </main>
)
}