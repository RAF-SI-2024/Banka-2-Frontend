import * as React from "react";
import {useBankAccountsData} from "@/hooks/sidebar/use-bank-accounts-data.ts";

export function AdminNavMainData() {

    const items = [
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
                // {
                //     title: "Tax tracking",
                //     url: "/tax/overview",
                //     icon: <span className="icon-[ph--invoice]" />,
                //     isCollapsed: true,
                // }
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
                    title: "Trading",
                    url: "/trading",
                    icon: <span className="icon-[ph--chart-line-up]"/>,
                    isCollapsed: false,
                },
                {
                    title: "Orders",
                    url: "/order/overview",
                    icon: <span className="icon-[ph--hand-deposit]"/>,
                    isCollapsed: true,
                },
                {
                    title: "Actuaries",
                    url: "/actuary/overview",
                    icon: <span className="icon-[ph--users-three]" />,
                    isCollapsed: true,
                },
            ]
        }

    ];
    const exchangeSection = items.find(section => section.label === "Exchange");
    if(exchangeSection) {
        const accounts = useBankAccountsData();
        console.log(accounts);
        if (accounts.length > 0) {
            exchangeSection.content.push({
                title: "Trading account",
                url: accounts[0].url,
                icon: <span className="icon-[ph--piggy-bank]"/>,
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

    return items;

}