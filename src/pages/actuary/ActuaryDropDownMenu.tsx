import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.tsx";
import {Actuary} from "@/types/actuary.ts";

type Props = {
    actuary: Actuary;
    onEdit: () => void;
    onResetLimit: () => void;
};

export default function ActuariesDropdownMenu({  actuary, onEdit, onResetLimit }: Props) {
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="icon-[ph--dots-three-bold] h-7 w-7" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Edit Actuary</DropdownMenuItem>
          <DropdownMenuItem onClick={onResetLimit}>Reset Used Limit</DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
  );
}
