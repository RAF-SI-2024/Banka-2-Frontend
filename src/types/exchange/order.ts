import {Actuary} from "@/types/bank_user/actuary.ts";
import {BankAccount} from "@/types/bank_user/bank-account.ts";

export interface Order {
    id: string;
    actuary: Actuary;

    email: string;
    username: string;
    orderType: OrderType;
    securityType: string;
    quantity: number;
    contractCount: number;
    pricePerUnit: number;
    direction: Direction;
    remainingPortions: number;
    status: OrderStatus;

    account: BankAccount;
    stopPrice: number;
    limitPrice: number;
}

export enum OrderType{
    INVALID,
    MARKET,
    LIMIT,
    STOP,
    STOP_LIMIT
}

export enum OrderDirection{
    INVALID,
    BUY,
    SELL
}

export interface CreateOrderRequest {
    actuaryId: string;
    accountNumber: string | null;
    orderType: OrderType,
    quantity: number;
    contractCount: number;
    limitPrice: number;
    stopPrice:  number;
    direction: OrderDirection;
    supervisorId?: string;
    securityId: string;

}

export interface UpdateOrderRequest{
    status: OrderStatus;
}


export interface OrderResponse {
    items: Order[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export enum Direction {
    Buy = 0 ,
    Sell = 1
}

export enum OrderStatus {
    INVALID,
    NEEDS_APPROVAL,
    ACTIVE,
    DECLINED,
    COMPLETED,
    CANCELED,
    FAILED
}

export function stringToOrderStatus(str: string): OrderStatus {
    switch (str) {
        case "NEEDS_APPROVAL":
            return OrderStatus.NEEDS_APPROVAL;
        case "ACTIVE":
            return OrderStatus.ACTIVE;
        case "DECLINED":
            return OrderStatus.DECLINED;
        case "COMPLETED":
            return OrderStatus.COMPLETED;
        case "CANCELED":
            return OrderStatus.CANCELED;
        case "FAILED":
            return OrderStatus.FAILED;
        default:
            return OrderStatus.INVALID;
    }
}

export function orderTypeToString(orderType: OrderType): string {
    switch (orderType) {
        case OrderType.INVALID:
            return "Invalid"
        case  OrderType.MARKET:
            return "Market"
        case OrderType.LIMIT:
            return "Limit"
        case OrderType.STOP:
            return "Stop"
        case  OrderType.STOP_LIMIT:
            return "Stop Limit"
    }
}



// 0 - Invalid
// 1 - NeedsApproval
// 2 - Active
// 3 - Declined
// 4 - Completed
// 5 - Canceled
// 6 - Failed