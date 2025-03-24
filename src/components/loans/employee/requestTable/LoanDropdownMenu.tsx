import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


type Props = {
    onApprove: () => void;
    onReject: () => void;
};

export default function LoanDropdownMenu({ onApprove, onReject }: Props) {
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onApprove}>Approve</DropdownMenuItem>
                <DropdownMenuItem onClick={onReject}>Reject</DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    );
}