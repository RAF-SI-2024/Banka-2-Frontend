import {Currency} from "@/types/currency.ts";

export interface PortfolioData {
    type: string,
    ticker: string,
    amount: number,
    price: number,
    currency: Currency,
    profit_loss : number,
    lastModified: Date,
    public: number
}

export interface PortfolioTaxData {
    currentYear: number,
    leftToPay: number,
    currency: Currency
}

export interface PortfolioBalanceData {
    profit: number,
    currency: Currency
}