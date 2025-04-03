import React, { useState } from "react";
import {Toaster} from "@/components/ui/sonner.tsx";
import TaxTable from "@/components/tax/TaxTable.tsx";

export default function TaxPage() {

    return (
        <main className="flex flex-1 flex-col gap-4 pt-0">
            <Toaster richColors/>
            <h1 className="font-display font-bold text-5xl">Tax table</h1>
            <TaxTable/>
        </main>
    );
}