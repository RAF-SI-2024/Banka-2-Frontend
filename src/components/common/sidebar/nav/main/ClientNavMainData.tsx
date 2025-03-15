import * as React from "react";
import {useBankAccountsData} from "@/hooks/sidebar/use-bank-accounts-data.ts";


export function ClientNavMainData() {


    return [
        {
            title: "Home",
            url: "/home",
            icon: <span className="icon-[ph--house]"/>,
            isCollapsed: true,
        },
        {
            title: "Bank Accounts",
            url: "#",
            icon: <span className="icon-[ph--piggy-bank]"/>,
            isCollapsed: true,
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
                    title: "Exchange",
                    url: "/payments/exchange",
                },
                {
                    icon: <span className="icon-[ph--hand-coins]"/>,
                    title: "Transfers",
                    url: "/payments/transfers",
                },
                {
                    icon: <span className="icon-[ph--users-three]"/>,
                    title: "Recipients",
                    url: "/payments/recipients",
                },
                {
                    icon: <span className="icon-[ph--list-magnifying-glass]"/>,
                    title: "Overview",
                    url: "/payments/overview",
                }
            ]
        },
        {
            title: "Cards",
            url: "/cards",
            icon: <span className="icon-[ph--credit-card]"/>,
            isCollapsed: false,
        },
        {
            title: "Loans",
            url: "/loans",
            icon: <span className="icon-[ph--bank]"/>,
            isCollapsed: false,
        },
    ]
}