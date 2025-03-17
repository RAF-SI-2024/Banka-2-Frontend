export function EmployeeNavMainData() {

    return [
        {
            title: "Bank Accounts",
            url: "/home",
            icon: <span className="icon-[ph--list-magnifying-glass]"/>,
            isCollapsed: true,
        },
        {
            title: "Loans Requests",
            url: "/loan-request",
            icon: <span className="icon-[ph--bank]"/>,
            isCollapsed: true,
        }
    ];
}