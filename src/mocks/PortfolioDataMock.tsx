import {PortfolioBalanceData, PortfolioData, PortfolioTaxData} from "@/types/exchange/portfolio-data.ts";
import {mockCurrencies} from "@/mocks/CurrencyMock.tsx";

// Mock portfolio podaci
export const portfolioDataMock: PortfolioData[] = [
    {
        type: "Stock",
        ticker: "AAPL",
        amount: 15,
        price: 180.2,
        currency: mockCurrencies[0], // USD
        profit_loss: 600,
        lastModified: new Date(),
        public: 5,
    },
    {
        type: "Crypto",
        ticker: "ETH",
        amount: 12,
        price: 3200,
        currency: mockCurrencies[1], // EUR
        profit_loss: -150,
        lastModified: new Date(),
        public: 2,
    },
    {
        type: "ETF",
        ticker: "SPY",
        amount: 8,
        price: 420,
        currency: mockCurrencies[2], // JPY
        profit_loss: 300,
        lastModified: new Date(),
        public: 3,
    },
    {
        type: "Bond",
        ticker: "UK10Y",
        amount: 30,
        price: 102,
        currency: mockCurrencies[3], // GBP
        profit_loss: 120,
        lastModified: new Date(),
        public: 20,
    },
    {
        type: "Forex",
        ticker: "EUR/RSD",
        amount: 5000,
        price: 117.5,
        currency: mockCurrencies[4], // RSD
        profit_loss: 50,
        lastModified: new Date(),
        public: 1000,
    }
];

export const mockPortfolioTaxData: PortfolioTaxData = {
    currentYear: 2000,
    leftToPay: 1500,
    currency: mockCurrencies[1]
};

export const mockPortfolioBalanceData: PortfolioBalanceData = {
    profit: 5000,
    currency: mockCurrencies[1]
};