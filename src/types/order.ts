export interface Order {
    email: string;
    username: string;
    orderType: string;
    securityType: string;
    quantity: number;
    contractSize: number;
    pricePerUnit: number;
    direction: Direction;
    remainingPortions: number;
    status: Status;
}

export enum Direction {
    Buy = 0 ,
    Sell = 1
}

export enum Status {
    Pending = 0,
    Approved = 1,
    Declined = 2,
    Done = 3
}