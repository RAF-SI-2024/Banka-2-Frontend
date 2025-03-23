import * as React from "react"
import { NavMain } from "@/components/__common__/sidebar/nav/main/NavMain.tsx"
import { NavUser } from "@/components/__common__/sidebar/nav/user/NavUser.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx"
import Logo from "@/assets/Logo.tsx";
import {ClientNavMainData} from "@/components/__common__/sidebar/nav/main/ClientNavMainData.tsx";
import {NavUserData} from "@/components/__common__/sidebar/nav/user/NavUserData.tsx";
import {EmployeeNavMainData} from "@/components/__common__/sidebar/nav/main/EmployeeNavMainData.tsx";
import {AdminNavMainData} from "@/components/__common__/sidebar/nav/main/AdminNavMainData.tsx";
import {Role} from "@/types/enums.ts";

function generateNavMainData(){
    if(sessionStorage.getItem("user") && JSON.parse(sessionStorage.user).role) {
        if (JSON.parse(sessionStorage.user).role == Role.Admin) {
            return AdminNavMainData();
        } else if (JSON.parse(sessionStorage.user).role == Role.Employee) {
            return EmployeeNavMainData()
        } else if (JSON.parse(sessionStorage.user).role == Role.Client) {
            return ClientNavMainData()
        }
    }
    return [];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarData = {
      navMain: generateNavMainData(),
      user: NavUserData
  }


  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg"  asChild>
              <a href="/home" className="hover:bg-transparent focus:bg-transparent active:bg-transparent hover:animate-pulse my-2 ">
                <span className="size-full flex items-center ">
                  <Logo className="h-full "></Logo>

                  </span>
              </a>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="font-paragraph text-2xl">
        <NavMain items={sidebarData.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
