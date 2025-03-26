import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {Actuary, ActuaryType} from "@/types/actuary.ts";
import {Role, User} from "@/types/user.ts";

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

  const showEdit =
      (!isEmployee && currentUserRole !== Role.Admin)
      || (isEmployee && actuary.actuaryType === ActuaryType.Agent);

  const editLabel = isEmployee ? "Adjust limit" : "Edit actuary";


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
            <DropdownMenuItem onClick={onEdit}>{editLabel}</DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onResetLimit}>Reset Used Limit</DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
