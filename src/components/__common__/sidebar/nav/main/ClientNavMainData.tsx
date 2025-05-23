import * as React from "react";
import {useBankAccountsData} from "@/hooks/sidebar/use-bank-accounts-data.ts";
import {useCreditCardsData} from "@/hooks/sidebar/use-credit-cards-data.ts";


export function ClientNavMainData() {


    return [
        {
            label: null,
            content: [
                {
                    title: "Home",
                    url: "/home",
                    icon: <span className="icon-[ph--house]"/>,
                },
            ]
        },
        {
            label: "Banking",
            content: [
                {
                    title: "Bank Accounts",
                    url: "#",
                    icon: <span className="icon-[ph--piggy-bank]"/>,
                    isCollapsed: false,
                    items: useBankAccountsData()
                },
                {
                    title: "Payments",
                    url: "#",
                    icon: <span className="icon-[ph--money-wavy]"/>,
                    isCollapsed: false,
                    items: [
                        {
                            icon: <span className="icon-[ph--file-plus]"/>,
                            title: "New payment",
                            url: "/payments/new",
                        },
                        {
                            icon: <span className="icon-[ph--arrows-clockwise]"/>,
                            title: "New transfer/exchange",
                            url: "/payments/transfer",
                        },
                        {
                            icon: <span className="icon-[ph--list-magnifying-glass]"/>,
                            title: "Exchange rate list",
                            url: "/payments/exchange-rate",
                        },
                        {
                            icon: <span className="icon-[ph--money-wavy]"/>,
                            title: "My payments",
                            url: "/payments/overview",
                        }
                    ]
                },
                {
                    title: "Cards",
                    url: "#",
                    icon: <span className="icon-[ph--credit-card]"/>,
                    isCollapsed: false,
                    items: useCreditCardsData()
                },
                {
                    title: "Loans",
                    url: "#",
                    icon: <span className="icon-[ph--bank]"/>,
                    isCollapsed: false,
                    items: [
                        {
                            title: "New loan request",
                            url: "/loan/new",
                            icon: <span className="icon-[ph--folder-simple-plus]"/>,
                        },
                        {
                            title: "My loans",
                            url: "/loan/overview",
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
                    title: "Trading",
                    url: "/trading",
                    icon: <span className="icon-[ph--chart-line-up]"/>,
                    isCollapsed: false,
                },
                {
                    title: "My Portfolio",
                    url: "/my-portfolio",
                    icon: <span className="icon-[ph--chalkboard-teacher]"/>,
                    isCollapsed: false,
                },
            ]
        }
    ]
}