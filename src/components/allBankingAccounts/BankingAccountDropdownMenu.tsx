import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {activateOrDeactivateBankAccount} from "@/api/bankAccount"

interface BankingAccountDropdownMenuProps {
    id: string;
    status: boolean;
    onStatusChange: (id: string, newStatus: boolean) => void;
}

export default function BankingAccountDropdownMenu({id, status, onStatusChange}: BankingAccountDropdownMenuProps) {
    const handleActivateOrDeactivate = async () => {
        try {
            const newStatus = !status;
            const response = await activateOrDeactivateBankAccount(id, newStatus);
            console.log("Account status updated successfully:", response);
            onStatusChange(id, newStatus);
        } catch (error) {
            console.error("Failed to update account status:", error);
        }
    };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="icon-[ph--dots-three-bold] h-7 w-7"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleActivateOrDeactivate}>
              {status ? "Deactivate account" : "Activate account"}
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
