import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


type Props = {
    onApprove: () => void;
    onDecline: () => void;
};

export default function OrderDropdownMenu({ onApprove, onDecline }: Props) {
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onApprove}>Approve</DropdownMenuItem>
                <DropdownMenuItem onClick={onDecline}>Decline</DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    );
}