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
            title: "Loans Requests",
            url: "/loan/request",
            icon: <span className="icon-[ph--bank]"/>,
            isCollapsed: true,
        }
    ];
}