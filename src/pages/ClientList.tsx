import {useState} from "react";
import {Toaster} from "@/components/ui/sonner.tsx";
import ClientTable from "@/components/client-list/ClientTable.tsx";

export default function ClientList() {
    const [isDialogOpen, setDialogOpen] = useState(false);

    return (
        <main>
            <Toaster richColors/>
            <ClientTable/>
        </main>
)
}