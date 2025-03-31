import {Actuary, ActuaryType} from "@/types/actuary";
import * as React from "react";

// prima actuary da bismo znali da li je supervizor ili agent
export function EmployeeNavMainData(actuary: Actuary) {
  const items = [
    {
      title: "Bank Accounts",
      url: "/home",
      icon: <span className="icon-[ph--list-magnifying-glass]" />,
      isCollapsed: true,
    },
    {
      title: "Client list",
      url: "/client-list",
      icon: <span className="icon-[ph--user-list]" />,
      isCollapsed: true,
    },
    {
      title: "Loans",
      url: "#",
      icon: <span className="icon-[ph--bank]" />,
      isCollapsed: false,
      items: [
        {
          title: "Loan requests",
          url: "/loan/request",
          icon: <span className="icon-[ph--files]" />,
        },
        {
          title: "All loans",
          url: "/loan/all",
          icon: <span className="icon-[ph--bank]" />,
        },
      ],
    },
    {
      title: "Securities",
      url: "/security/overview",
      icon: <span className="icon-[ph--chart-line-up]"/>,
      isCollapsed: false,
    },
  ];

  if (true) { // TODO - staviti samo ako je supervisor (iz jwt)
    items.push({
      title: "Actuaries",
      url: "/actuary/overview",
      icon: <span className="icon-[ph--users-three]" />,
      isCollapsed: true,
    });
  }
  items.push(
      {
          title: "Orders",
          url: "/order/overview",
          icon: <span className="icon-[ph--hand-deposit]"/>,
          isCollapsed: true,
      }
  )
  if (true) { // TODO - staviti samo ako je supervisor (iz jwt)
    items.push({
      title: "Tax tracking",
      url: "/tax/overview",
      icon: <span className="icon-[ph--invoice]" />,
      isCollapsed: true,
    });
  }

  return items;

}