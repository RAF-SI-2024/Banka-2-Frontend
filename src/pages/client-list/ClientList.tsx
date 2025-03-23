import {Toaster} from "@/components/ui/sonner.tsx";
import ClientTable from "@/components/user-table/clients/ClientTable.tsx";

export default function ClientList() {
    return (
        <main>
            <Toaster richColors/>
            <ClientTable/>
        </main>
)
}