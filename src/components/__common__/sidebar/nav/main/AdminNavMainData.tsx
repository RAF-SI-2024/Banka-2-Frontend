import * as React from "react";

export function AdminNavMainData() {

    return [
        {
            label: "Management",
            content: [
                {
                    title: "Users",
                    url: "/home",
                    icon: <span className="icon-[ph--user-list]"/>,
                    isCollapsed: true,
                },
            ]
        },
        {
            label: "Banking",
            content: [
                {
                    title: "Bank Accounts",
                    url: "/bank-account-list",
                    icon: <span className="icon-[ph--list-magnifying-glass]"/>,
                    isCollapsed: true,
                },
                {
                    title: "Loans",
                    url: "#",
                    icon: <span className="icon-[ph--bank]"/>,
                    isCollapsed: false,
                    items: [
                        {
                            title: "Loan requests",
                            url: "/loan/request",
                            icon: <span className="icon-[ph--files]"/>,
                        },
                        {
                            title: "All loans",
                            url: "/loan/all",
                            icon: <span className="icon-[ph--bank]"/>,
                        }
                    ]
                },
            ]
        },
        {
            label: "Exchange",
            content: [
                {
                    title: "Exchanges",
                    url: "/exchanges",
                    icon: <span className="icon-[ph--buildings]"/>,
                    isCollapsed: false,
                },
                {
                    title: "Actuaries",
                    url: "/actuary/overview",
                    icon: <span className="icon-[ph--users-three]" />,
                    isCollapsed: true,
                },
                {
                    title: "Orders",
                    url: "/order/overview",
                    icon: <span className="icon-[ph--hand-deposit]"/>,
                    isCollapsed: true,
                },
                {
                    title: "Trading",
                    url: "/trading",
                    icon: <span className="icon-[ph--chart-line-up]"/>,
                    isCollapsed: false,
                }, 
            ]
        }

    ];
}