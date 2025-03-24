import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


type Props = {
    onDetail: () => void;
};

export default function LoanOverviewDropdownMenu({ onDetail }: Props) {
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDetail}>Details</DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    );
}