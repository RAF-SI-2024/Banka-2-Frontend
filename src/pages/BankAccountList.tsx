import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import BankingAccountsTable from "@/components/allBankingAccounts/BankingAccountsTable.tsx";

export default function BankAccountListPage() {
    const navigate = useNavigate();
    return (
        <main>
            <BankingAccountsTable  />

            <div className="fixed bottom-4 md:right-4 right-1/2 transform translate-x-1/2 md:translate-x-0 z-50 -mr-2 -mb-2">
                <Button className="size16 rounded-4xl" variant="success" onClick={() => navigate('/create-account')}>
                    Create a new bank account
                    <span className="icon-[ph--plus] text-lg"></span>
                </Button>
            </div>

        </main>
    );
}

