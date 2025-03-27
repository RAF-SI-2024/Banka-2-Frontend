import { Button } from "@/components/ui/button.tsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.tsx";
//import { showSuccessToast } from "@/utils/toasts"; // Ako koristite toaste
import { useState } from "react";
import ApproveDeclineConfirmationDialog from "@/components/home/ApproveDeclineConfirmationDialog";

type Props = {
    onApprove: (orderId: string) => void;
    onDecline: (orderId: string) => void;
    orderId: string;
};

export default function OrderDropdownMenu({ onApprove, onDecline, orderId }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [action, setAction] = useState<"approve" | "decline" | null>(null);
    const handleConfirm = () => {
        if (action === "approve") {
            onApprove(orderId);
            //showSuccessToast("Order Approved");
        } else if (action === "decline") {
            onDecline(orderId);
            //showSuccessToast("Order Declined");
        }
        setIsDialogOpen(false); // Zatvoriti dijalog nakon potvrde
    };

    const handleCancel = () => {
        setIsDialogOpen(false); // Zatvoriti dijalog ako korisnik otkaže
    };

    const openDialogForApprove = () => {
        setAction("approve");
        setIsDialogOpen(true);
    };

    const openDialogForDecline = () => {
        setAction("decline");
        setIsDialogOpen(true);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    {/* Approve opcija */}
                    <DropdownMenuItem
                        className="text-success flex items-center gap-2"
                        onClick={openDialogForApprove}
                    >
                        <i className="icon-[ph--check-circle]" /> Approve
                    </DropdownMenuItem>

                    {/* Decline opcija */}
                    <DropdownMenuItem
                        className="text-destructive flex items-center gap-2"
                        onClick={openDialogForDecline}
                    >
                        <i className="icon-[ph--x-circle]" /> Decline
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dijalog za potvrdu */}
            <ApproveDeclineConfirmationDialog
                open={isDialogOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                actionType={action!} // Garantovano je da nije null jer je akcija postavljena pre dijaloga
            />
        </>
    );
}
