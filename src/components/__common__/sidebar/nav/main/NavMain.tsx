import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.ts";

export function NavMain({
                          items,
                        }: {
  items: {
    label: string | null;
    content: {
      title: string;
      url: string;
      icon: React.ReactNode;
      isCollapsed?: boolean;
      items?: {
        title: string;
        icon?: React.ReactNode;
        url: string;
      }[];
    }[];
  }[];
}) {
  return (
      <>
        {items.map((group) =>
            (
                <SidebarGroup key={group.label} className="m-0 p-0 mb-4">
                  {group.label !== null && (<SidebarGroupLabel>{group.label}</SidebarGroupLabel>)}
                  <SidebarGroupContent>{generateGroupContent(group.content)}</SidebarGroupContent>
                </SidebarGroup>
            )
        )}
      </>
  );
}

function generateGroupContent(
    items: {
      title: string;
      url: string;
      icon: React.ReactNode;
      isCollapsed?: boolean;
      items?: {
        title: string;
        icon?: React.ReactNode;
        url: string;
      }[];
    }[]
) {
  const location = useLocation();


  return (
      <SidebarMenu className="font-paragraph">
        {items.map((item) => {
          const isSelected = location.pathname.startsWith(item.url);

          return (
              <Collapsible key={item.title + "-" + item.url} asChild defaultOpen={item.isCollapsed}>
                <SidebarMenuItem className={cn(isSelected ? "bg-gradient-to-r from-primary/30 via-secondary/15 to-sidebar rounded-sm text-foreground" : "")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title} className="hover:rounded-none">
                      {item.url !== "#" ? (
                          <a href={item.url} className="h-10 items-center">
                      <span className="text-base font-paragraph inline-flex items-center gap-2 ml-2">
                        <span className="inline-flex items-center">{item.icon}</span>
                        <span>{item.title}</span>
                      </span>
                          </a>
                      ) : (
                          <div className="h-10 items-center">
                      <span className="text-base font-paragraph inline-flex items-center gap-2 ml-2">
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
                            <span className="icon-[ph--caret-right]" />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => {
                              const isSubItemSelected = location.pathname.startsWith(subItem.url);
                              return (
                                  <SidebarMenuSubItem
                                      key={subItem.title + "-" + subItem.url}
                                      className={cn(isSubItemSelected ? "bg-gradient-to-r from-primary/30 via-secondary/15 to-sidebar rounded-sm text-foreground" : "")}
                                  >
                                    <SidebarMenuSubButton asChild>
                                      <a href={subItem.url} className="h-4 items-center">
                                <span className="font-paragraph inline-flex items-center gap-2">
                                  <span className="inline-flex items-center">{subItem.icon}</span>
                                  <span className="truncate">{subItem.title}</span>
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
