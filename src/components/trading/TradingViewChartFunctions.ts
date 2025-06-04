import {QuoteDailySimpleResponse } from "@/types/exchange/security.ts";

interface CandleData {
    time: number;       // Unix timestamp in milliseconds
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
}

function generateCandleData(quoteData: QuoteDailySimpleResponse[]): CandleData[] {
    const candles: CandleData[] = [];


    let time = new Date().getTime();

    console.log(quoteData);


    for (let i = quoteData.length - 1; i >= 0; i--) {
        candles.push(createCandleFromQuote(quoteData[i], time));
        time = time - 24 * 60 * 60_000; // 24 hrs before last quote

    }



    return candles.reverse();
}

function createCandleFromQuote(quote : QuoteDailySimpleResponse, time: number): CandleData {
    const open = quote.openPrice;
    const close = quote.closePrice;
    const high = quote.highPrice;
    const low = quote.lowPrice;
    const volume = quote.volume;

    return { time:Math.floor(time / 1000), open, close, high, low, volume };
}


export class Datafeed {
    private _quoteData: QuoteDailySimpleResponse[];
    private _data: CandleData[];

    constructor(quoteData: QuoteDailySimpleResponse[]) {
        this._quoteData = quoteData;
        this._data = [];
    }

    getBars(): CandleData[] {
        const historicalData = generateCandleData(this._quoteData);
        this._data = [...historicalData];
        return this._data;
    }
}
