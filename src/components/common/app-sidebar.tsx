import * as React from "react"


import { NavMain } from "@/components/common/nav/nav-main.tsx"

import { NavUser } from "@/components/common/nav/nav-user.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx"
import Logo from "@/components/common/logo.tsx";

const data = {
  user: {
    name: "user",
    email: "user@gmail.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: <span className="icon-[ph--house]" />,
      isSelected: true,
      isCollapsed: true,
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="hover:bg-transparent hover:animate-pulse">
                <span className="size-full flex items-center">
                  <Logo className="h-full"></Logo>

                  </span>
              </a>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="font-paragraph">
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
