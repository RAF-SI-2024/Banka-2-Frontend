import {Button} from "@/components/ui/button.tsx";
import BankingAccountsTable from "@/components/bank-account/bank-account-table/BankingAccountsTable.tsx";
import {useState} from "react";
import CreateBankAccountDialog from "@/components/bank-account/bank-account-create/CreateBankAccountDialog.tsx";
import RegisterDialog from "@/components/register/RegisterDialog.tsx";
import {Role} from "@/types/enums.ts";
import {Toaster} from "@/components/ui/sonner.tsx";

export default function BankAccountListPage() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

    const onRegister = () => {
        setRegisterDialogOpen(true);
    }
    return (
        <main>
            <Toaster richColors />
            <BankingAccountsTable  />

            <div className="fixed bottom-4 md:right-4 right-1/2 transform translate-x-1/2 md:translate-x-0 z-50 -mr-2 -mb-2">
                <Button className="size16 rounded-4xl" variant="success"   onClick={() => setDialogOpen(true)} >
                    <span className="icon-[ph--plus] text-lg"></span>
                    Create a new bank account
                </Button>
            </div>

            <RegisterDialog
                onClose={() => setRegisterDialogOpen(false)}
                onSuccess={(email) => setRegisteredEmail(email)}
                variant={Role.Employee}
                open={isRegisterDialogOpen}
            />

            <CreateBankAccountDialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onRegister={onRegister}
                registeredEmail={registeredEmail === null ? undefined : registeredEmail}
            />

        </main>
    );
}

