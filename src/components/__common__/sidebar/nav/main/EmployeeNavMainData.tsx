import {Permission} from "@/types/bank_user/actuary.ts";
import * as React from "react";
import {useBankAccountsData} from "@/hooks/sidebar/use-bank-accounts-data.ts";

// Function that returns navigation items based on actuary type
export function EmployeeNavMainData(permission: Permission) {
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
          title: "All bank accounts",
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

  ];

  if (permission == Permission.Supervisor) {
    const bankingSection = items.find(section => section.label === "Banking");
    if(bankingSection){
      bankingSection.content.push({
        title: "Tax tracking",
            url: "/tax/overview",
            icon: <span className="icon-[ph--invoice]" />,
            isCollapsed: true,
      });
    }
  }
  if(permission == Permission.Agent || permission == Permission.Supervisor) {
      items.push({
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
      })
    const exchangeSection = items.find(section => section.label === "Exchange");
    if (permission === Permission.Supervisor) {

      if (exchangeSection) {
        exchangeSection.content.push({
          title: "Actuaries",
          url: "/actuary/overview",
          icon: <span className="icon-[ph--users-three]" />,
          isCollapsed: true,
        });
      }

    }

    if(exchangeSection){
      const accounts = useBankAccountsData();
      if(accounts.length > 0) {
        exchangeSection.content.push({
          title: "Trading account",
          url: accounts[0].url,
          icon: <span className="icon-[ph--piggy-bank]" />,
          isCollapsed: false,
        })
      }

      exchangeSection.content.push({
          title: "My portfolio",
          url: "/my-portfolio",
          icon: <span className="icon-[ph--chalkboard-teacher]"/>,
          isCollapsed: false,
      })
    }

  }




  return items;
}
