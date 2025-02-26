import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

export default function UserDropdownMenu({ onEdit, onDelete }: Props) {
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit User</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>Delete User</DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    );
}