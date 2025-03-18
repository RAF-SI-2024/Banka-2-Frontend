export function EmployeeNavMainData() {

    return [
        {
            title: "Bank Accounts",
            url: "/home",
            icon: <span className="icon-[ph--list-magnifying-glass]"/>,
            isCollapsed: true,
        },
        {
            title: "Client list",
            url: "/client-list",
            icon: <span className="icon-[ph--user-list]"/>
        },
        {
            title: "Loan requests",
            url: "/loan/request",
            icon: <span className="icon-[ph--bank]"/>,
            isCollapsed: true,
        },
        {
            title: "All loans",
            url: "/loan/all",
            icon: <span className="icon-[ph--bank-thin]"/>,
            isCollapsed: true,
        }
    ];
}