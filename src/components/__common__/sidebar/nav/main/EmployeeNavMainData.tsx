import { Actuary, ActuaryType } from "@/types/actuary";
import * as React from "react";

// Function that returns navigation items based on actuary type
export function EmployeeNavMainData(actuary: Actuary) {
  const items = [
    {
      label: "Management",
      content: [
        {
          title: "Client list",
          url: "/home",
          icon: <span className="icon-[ph--user-list]" />,
          isCollapsed: true,
        },
      ]
    },
    {
      label: "Banking",
      content: [
        {
          title: "All Bank Accounts",
          url: "/bank-account-list",
          icon: <span className="icon-[ph--list-magnifying-glass]" />,
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
      ],
    },
    {
      label: "Exchange",
      content: [
        {
          title: "Trading",
          url: "/trading",
          icon: <span className="icon-[ph--chart-line-up]" />,
          isCollapsed: false,
        },
        {
          title: "Orders",
          url: "/order/overview",
          icon: <span className="icon-[ph--hand-deposit]" />,
          isCollapsed: true,
        },
      ],
    },
  ];

  // Add the "Actuaries" menu item only if the actuary is a supervisor
  if (actuary.actuaryType === ActuaryType.Supervisor) {
    const exchangeSection = items.find(section => section.label === "Exchange");
    if (exchangeSection) {
      exchangeSection.content.push({
        title: "Actuaries",
        url: "/actuary/overview",
        icon: <span className="icon-[ph--users-three]" />,
        isCollapsed: true,
      });
    }
  }

  return items;
}
