import UserTable from "@/components/usertable/UserTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import RegisterDialog from "@/components/register/RegisterDialog.tsx";
import {Role} from "@/types/enums.ts";

export default function UserListPage() {
    const [isDialogOpen, setDialogOpen] = useState(false);

    return (
        <main>
            <UserTable />

            <div className="fixed bottom-4 md:right-4 right-1/2 transform translate-x-1/2 md:translate-x-0 z-50 -mr-2 -mb-2">
                <Button
                    className="size16 rounded-4xl"
                    variant="success"
                    onClick={() => setDialogOpen(true)}
                >
                    <span className="icon-[ph--user-plus] text-lg"></span>
                    Register a new employee

                </Button>
            </div>

            <RegisterDialog variant={Role.Admin} open={isDialogOpen} onClose={() => setDialogOpen(false)} />
        </main>
    );
}
