import { Button } from "@/components/ui/button.tsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.tsx";


type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

export default function UserDropdownMenu({ onEdit, onDelete }: Props) {
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" data-cy="three-dots-action-user"/>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={onEdit}>Edit User
                </DropdownMenuItem>
                {/*<DropdownMenuItem onClick={onDelete}>Delete User</DropdownMenuItem>*/}
            </DropdownMenuContent>

        </DropdownMenu>
    );
}