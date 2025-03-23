export function AdminNavMainData() {

    return [
        {
            title: "Users",
            url: "/home",
            icon: <span className="icon-[ph--user-list]"/>,
            isCollapsed: true,
        },
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
    ];
}