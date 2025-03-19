import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

export default function TemplateDropdownMenu({ onEdit, onDelete }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="flex items-center">
                    <span className="icon-[ph--pencil] mr-2" /> Edit Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="flex items-center">
                    <span className="icon-[ph--trash] mr-2" /> Delete Template
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
