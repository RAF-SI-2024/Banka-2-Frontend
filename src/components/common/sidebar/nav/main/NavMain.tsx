import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import * as React from "react"
import { useLocation } from "react-router-dom"

export function NavMain({
                          items,
                        }: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isCollapsed?: boolean
    items?: {
      title: string
      icon?: React.ReactNode
      url: string
    }[]
  }[]
}) {
  const location = useLocation()  // ✅ Get current route

  return (
      <SidebarMenu className="font-paragraph">
        {items.map((item) => {
          const isSelected = location.pathname.startsWith(item.url); // ✅ Check current route

          return (
              <Collapsible key={item.title + "-" + item.url} asChild defaultOpen={item.isCollapsed}>
                <SidebarMenuItem className={isSelected ? "bg-primary/25 rounded-lg text-foreground" : ""}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      {item.url !== "#" ? (
                          <a href={item.url} className="h-10 items-center">
                            <span className="text-lg font-heading inline-flex items-center gap-2">
                              <span className="inline-flex items-center">{item.icon}</span>
                              <span>{item.title}</span>
                            </span>
                          </a>
                      ) : (
                          <div className="h-10 items-center">
                            <span className="text-lg font-heading inline-flex items-center gap-2">
                              <span className="inline-flex items-center">{item.icon}</span>
                              <span>{item.title}</span>
                            </span>
                          </div>
                      )}

                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90 hover:cursor-pointer">
                            <span className="icon-[ph--caret-right]"/>
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => {
                              const isSubItemSelected = location.pathname.startsWith(subItem.url); // Check for subitem route
                              return (
                                  <SidebarMenuSubItem
                                      key={subItem.title + "-" + subItem.url}
                                      className={isSubItemSelected ? "bg-primary/25 rounded-lg text-foreground" : ""}
                                  >
                                    <SidebarMenuSubButton asChild>
                                      <a href={subItem.url} className="h-4 items-center">
                              <span className="font-paragraph inline-flex items-center gap-2">
                                <span className="inline-flex items-center">{subItem.icon}</span>
                                <span>{subItem.title}</span>
                              </span>
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
          );
        })}
      </SidebarMenu>
  );

}