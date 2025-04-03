export interface Security {
    id: string;
    name: string;
    type: SecurityType;
    price: number;
    priceChange: number;
}

export enum SecurityType {
    Stocks,
    Futures,
    Forex,
    Options,
    Unknown
}

export function getSecurityTypeName(type: SecurityType): string {
    switch(type){
        case SecurityType.Stocks:
            return 'stocks';
        case SecurityType.Futures:
            return 'futures';
        case SecurityType.Forex:
            return 'Forex';
        case SecurityType.Options:
            return 'Options';
        default:
            return 'Unknown';
    }
}
