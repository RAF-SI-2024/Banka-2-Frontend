export interface Security {
    id: string;
    name: string;
    type: SecurityType;
    price: number;
    priceChange: number;
}

export enum SecurityType {
    Stock,
    Future,
    Forex,
    Option,
    Unknown
}

export function getSecurityTypeName(type: SecurityType): string {
    switch(type){
        case SecurityType.Stock:
            return 'Stock';
        case SecurityType.Future:
            return 'Future';
        case SecurityType.Forex:
            return 'Forex';
        case SecurityType.Option:
            return 'Option';
        default:
            return 'Unknown';
    }
}

export function getSecurityTypePlural(type: SecurityType): string {
    switch(type){
        case SecurityType.Stock:
            return 'Stocks';
        case SecurityType.Future:
            return 'Futures';
        case SecurityType.Forex:
            return 'Forex';
        case SecurityType.Option:
            return 'Options';
        default:
            return 'Unknown';
    }
}
