import UserTable from "@/components/usertable/UserTable.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export default function UserListPage() {
    const navigate = useNavigate();
    return (
        <main>
            <UserTable  />

            <div className="fixed bottom-4 md:right-4 right-1/2 transform translate-x-1/2 md:translate-x-0 z-50 -mr-2 -mb-2">
                <Button className="size16 rounded-4xl" variant="success" onClick={() => navigate('/register')}>
                    Register a new employee
                    <span className="icon-[ph--user-plus] text-lg"></span>
                </Button>
            </div>

        </main>
    );
}

