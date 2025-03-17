import UserTable from "@/components/usertable/UserTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import RegisterDialog from "@/components/register/RegisterDialog.tsx";
import {Role} from "@/types/enums.ts";
import {Toaster} from "@/components/ui/sonner.tsx";
// import LoanRequestTable from "@/components/loans/LoanRequestTable";

export default function LoanRequestList() {
    const [isDialogOpen, setDialogOpen] = useState(false);

    return (
        <main>
            <Toaster richColors />
            {/*<LoanRequestTable />*/}
            <RegisterDialog variant={Role.Admin} open={isDialogOpen} onClose={() => setDialogOpen(false)} />
        </main>
    );
}
