import {Actuary, ActuaryType} from "@/types/actuary";

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
  ];

  if (actuary?.actuaryType === ActuaryType.Supervisor) {
    items.push({
      title: "Actuaries",
      url: "/actuaries",
      icon: <span className="icon-[ph--users-three]" />,
      isCollapsed: true,
    });
  }

  return items;

}
