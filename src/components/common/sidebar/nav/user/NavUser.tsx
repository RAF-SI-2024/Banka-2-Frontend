import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.tsx"
import {useAuth} from "@/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import PasswordChangeDialog from "@/components/passwordChange/PasswordChangeDialog.tsx";

export function NavUser() {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()  // ✅ Get navigate in component

  // TODO Make a settings window where password change can be an option
  // State for showing password change dialog
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })  // ✅ Navigate after logout
  }
  const rawData = sessionStorage.getItem("user")
  let user = {
    email: "",
    avatar: "",
    firstName: "",
    lastName: "",
  }
  if (rawData) {
    user = JSON.parse(rawData);
  }

  return (
    <SidebarMenu className="font-paragraph">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent/70 data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.firstName} />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <span className="icon-[ph--dots-three-circle] ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-sidebar"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>


            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
            >
              <span className="icon-[ph--pencil-simple-line-light]" />
              Edit profile

            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-sidebar-destructive-foreground"
                onClick={handleLogout}
            >
              <span className="icon-[ph--sign-out]" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {/* Ubaciti narednu liniju u prozor za podesavanja */}
      <PasswordChangeDialog showDialog={showEditDialog} setShowDialog={setShowEditDialog}/>
    </SidebarMenu>
  )
}
