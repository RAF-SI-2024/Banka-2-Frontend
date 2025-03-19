export function EmployeeNavMainData() {

    return [
        {
            title: "Bank Accounts",
            url: "/home",
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