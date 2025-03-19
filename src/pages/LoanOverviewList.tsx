import {Toaster} from "@/components/ui/sonner.tsx";
import LoanOverviewTable from "@/components/loans/client/LoanOverviewTable";


export default function LoanOverviewList() {
    return (
        <main>
            <Toaster richColors />
            <LoanOverviewTable />
        </main>
    );
}
