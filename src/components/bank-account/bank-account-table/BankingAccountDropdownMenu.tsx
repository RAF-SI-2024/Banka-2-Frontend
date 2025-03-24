import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.tsx"
import {activateOrDeactivateBankAccount} from "@/api/bank-account.ts"
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

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
            showSuccessToast({description: "Account status updated successfully."})
            console.log("Account status updated successfully:", response);
            onStatusChange(id, newStatus);
        } catch (error) {
            console.error("Failed to update account status:", error);
            showErrorToast({error, defaultMessage: "Failed to update account status"});
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
              {status ? "Block account" : "Unblock account"}
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
