import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Actuary, Permission } from "@/types/bank_user/actuary.ts";
import { Role, User } from "@/types/bank_user/user.ts";

type Props = {
  currentUserRole: Role;
  actuary: Actuary;
  onEdit: () => void;
  onResetLimit: () => void;
};

export default function ActuariesDropdownMenu({
  actuary,
  currentUserRole,
  onEdit,
  onResetLimit,
}: Props) {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}") as User;
  const isEmployee = user?.role === Role.Employee;

  const showEdit = isEmployee
    ? actuary.actuaryType === Permission.Agent
    : currentUserRole !== Role.Admin;

  const showResetLimit = actuary.actuaryType === Permission.Agent;

  if (!(showEdit || showResetLimit)) return null; // Ako nema opcija, dropdown se ne prikazuje

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="icon-[ph--dots-three-bold] h-7 w-7"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {showEdit && (
          <DropdownMenuItem onClick={onEdit}>
            {isEmployee ? "Adjust limit" : "Edit actuary"}
          </DropdownMenuItem>
        )}
        {showResetLimit && (
          <DropdownMenuItem onClick={onResetLimit}>
            Reset Used Limit
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
