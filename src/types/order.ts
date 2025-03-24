export interface Order {
    email: string;
    username: string;
    orderType: string;
    securityType: string;
    quantity: number;
    contractSize: number;
    pricePerUnit: number;
    direction: "Buy" | "Sell";
    remainingPortions: number;
    status: "pending" | "approved" | "declined" | "done";
}