import React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { changeCardStatusEmployee } from "@/api/card";

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
            console.log("Card status updated successfully:", response);
            onStatusChange(id, newStatus);
        } catch (error) {
            console.error("Failed to update card status:", error);
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
                    {status ? "Deactivate card" : "Activate card"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CreditCardDropdownMenu;
