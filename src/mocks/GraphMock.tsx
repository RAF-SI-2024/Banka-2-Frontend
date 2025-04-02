import {CandleData} from "@/components/securities/ChartUtils.tsx";
import {Time} from "lightweight-charts";

let randomFactor = 25 + Math.random() * 25;

const samplePoint = (i: number) =>
    i *
    (0.5 +
        Math.sin(i / 1) * 0.2 +
        Math.sin(i / 2) * 0.4 +
        Math.sin(i / randomFactor) * 0.8 +
        Math.sin(i / 50) * 0.5) +
    200 +
    i * 2;

function generateLineData(numberOfPoints = 500, endDate: Date) {
    randomFactor = 25 + Math.random() * 25;
    const res = [];
    const date = endDate || new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
    date.setUTCDate(date.getUTCDate() - numberOfPoints - 1);
    for (let i = 0; i < numberOfPoints; ++i) {
        const time = date.getTime() / 1000;
        const value = samplePoint(i);
        res.push({
            time,
            value,
        });

        date.setUTCDate(date.getUTCDate() + 1);
    }

    return res;
}

function randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function randomBar(lastClose: number) {
    const open = +randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
    const close = +randomNumber(open * 0.95, open * 1.05).toFixed(2);
    const high = +randomNumber(
        Math.max(open, close),
        Math.max(open, close) * 1.1
    ).toFixed(2);
    const low = +randomNumber(
        Math.min(open, close) * 0.9,
        Math.min(open, close)
    ).toFixed(2);
    return {
        open,
        high,
        low,
        close,
    };
}

function generateCandleData(numberOfPoints = 250, endDate: Date) {
    const lineData = generateLineData(numberOfPoints, endDate);
    let lastClose = lineData[0].value;
    return lineData.map(d => {
        const candle = randomBar(lastClose);
        lastClose = candle.close;
        return {
            time: d.time,
            low: candle.low,
            high: candle.high,
            open: candle.open,
            close: candle.close,
            volume: randomNumber(100000, 10000000),
        };
    });
}

interface Data{
    time: number;
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
}

export class Datafeed {
    private _earliestDate: Date;
    private _data: Data[];

    constructor() {
        this._earliestDate = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
        this._data = [];
    }

    getBars(numberOfExtraBars: number) {
        const historicalData = generateCandleData(
            numberOfExtraBars,
            this._earliestDate
        );
        this._data = [...historicalData, ...this._data];
        this._earliestDate = new Date(historicalData[0].time * 1000);
        return this._data;
    }
}


export function generateRealtimeData(
    lastValue: number,
    updatesPerCandle = 5,
    numberOfPoints = 10000,
) {
    const createCandle = (val: number, volume:number, time: number) => ({
        time,
        open: val,
        high: val,
        low: val,
        close: val,
        volume: volume,
    });

    const updateCandle = (candle: CandleData, val: number) => ({
        time: candle.time,
        close: val,
        open: candle.open,
        low: Math.min(candle.low, val),
        high: Math.max(candle.high, val),
        volume: candle.volume,
    });

    const date = new Date();

    const realtimeUpdates = [];
    let lastCandle: CandleData;
    let previousValue = lastValue;

    for (let i = 0; i < numberOfPoints; ++i) {
        if (i % updatesPerCandle === 0) {
            date.setUTCDate(date.getUTCDate() + 1);
        }
        const time = date.getTime() / 1000;
        let value = samplePoint(i);
        const diff = (value - previousValue) * ((Math.random() - 0.5) / (Math.random()*80 + 20));
        value = previousValue + diff;
        previousValue = value;
        if (i % updatesPerCandle === 0) {
            const candle = createCandle(value, randomNumber(100000, 10000000), time);
            lastCandle = candle;
            realtimeUpdates.push(candle);
        } else {
            // @ts-ignore
            const newCandle = updateCandle(lastCandle, value);
            lastCandle = newCandle;
            realtimeUpdates.push(newCandle);

        }
    }

    return {
        realtimeUpdates,
    };
}

//@ts-ignore
export function* getNextRealtimeUpdate(realtimeData) {
    for (const dataPoint of realtimeData) {
        yield dataPoint;
    }
    return null;
}
