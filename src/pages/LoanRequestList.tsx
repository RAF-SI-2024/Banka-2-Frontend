import {Toaster} from "@/components/ui/sonner.tsx";
import LoanRequestTable from "@/components/loans/request/LoanRequestTable";


export default function LoanRequestList() {
    return (
        <main>
            <Toaster richColors />
            <LoanRequestTable />
        </main>
    );
}
