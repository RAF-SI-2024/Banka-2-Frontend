"use client"



import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import * as React from "react";
import {ReactNode} from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string

    url: string
    icon: React.ReactNode,
    isCollapsed?: boolean,
    isSelected?: boolean,
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {

  return (
    // <SidebarGroup>
    //   <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="font-paragraph">
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isCollapsed}>
            <SidebarMenuItem className={ item.isSelected ? "bg-primary/25 rounded-lg text-foreground" : ""}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <span className="icon-[ph--caret-right]" />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    // </SidebarGroup>
  )
}
