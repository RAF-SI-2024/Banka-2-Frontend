export interface ExchangeTableData {
    name: string;
    acronym: string;
    micCode: string;
    country: string;
    currency: string;
    timeZone: string;
    openTime: string;
    closeTime: string;
}


export interface ExchangeTableDataResponse {
    items: ExchangeTableData[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}