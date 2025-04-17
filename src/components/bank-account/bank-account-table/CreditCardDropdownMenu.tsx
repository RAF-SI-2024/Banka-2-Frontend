import React from "react";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu.tsx";
import { changeCardStatusEmployee } from "@/api/bank_user/card.ts";
import {showErrorToast, showSuccessToast} from "@/lib/show-toast-utils.tsx";

export interface CreditCardDropdownMenuProps {
    id: string;
    status: boolean;
    onStatusChange: (id: string, newStatus: boolean) => void;
}

const CreditCardDropdownMenu: React.FC<CreditCardDropdownMenuProps> = ({
   id,
   status,
   onStatusChange,
}) => {
    const handleActivateOrDeactivate = async () => {
        try {
            const newStatus = !status;
            const response = await changeCardStatusEmployee(id, newStatus);
            showSuccessToast({description: "Card status updated successfully."})
            console.log("Card status updated successfully:", response);
            onStatusChange(id, newStatus);
        } catch (error) {
            console.error("Failed to update card status:", error);
            showErrorToast({error, defaultMessage: "Failed to update card status"});
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
                    {status ? "Block card" : "Unblock card"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CreditCardDropdownMenu;
