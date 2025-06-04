import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_SOCKET } from '@/constants/endpoints.ts';
import {QuoteSimpleResponse} from "@/types/exchange/security.ts";

interface CandleData {
    time: number; // Unix timestamp in seconds
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface CandleGenerator {
    next: () => Promise<CandleData | null>;
    close: () => void;
}

export function useRealtimeCandleGenerator(ticker: string, interval: number): CandleGenerator {
    const [currentCandle, setCurrentCandle] = useState<CandleData | null>(null);
    const lastVolumeRef = useRef<number>(0);
    const messageQueueRef = useRef<QuoteSimpleResponse[]>([]);
    const resolverRef = useRef<((value: CandleData) => void) | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_SOCKET}/security-hub`)
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        // Start connection and subscribe to ticker
        connection.start()
            .then(() => connection.invoke('Subscribe', [ticker]))
            .catch(console.error);

        // Receive updates from server
        connection.on('ReceiveSecurityUpdate', (quote: QuoteSimpleResponse) => {
            messageQueueRef.current.push(quote);
            processQueue();
        });

        return () => {
            connection.invoke('Unsubscribe', [ticker]).catch(() => {});
            connection.stop();
        };
    }, [ticker]);

    const processQueue = () => {
        if (!resolverRef.current || messageQueueRef.current.length === 0) return;

        while (messageQueueRef.current.length > 0) {
            const quote = messageQueueRef.current.shift()!;
            const midPrice = (quote.askPrice + quote.bidPrice) / 2;
            const timestamp = new Date(quote.createdAt).getTime();
            const candleTime = Math.floor(timestamp / interval) * interval;

            const volumeDelta = quote.volume - lastVolumeRef.current;
            lastVolumeRef.current = quote.volume;

            if (!currentCandle || currentCandle.time !== candleTime / 1000) {
                // New candle
                const newCandle: CandleData = {
                    time: candleTime / 1000,
                    open: midPrice,
                    high: midPrice,
                    low: midPrice,
                    close: midPrice,
                    volume: volumeDelta,
                };
                setCurrentCandle(newCandle);
                resolverRef.current(newCandle);
            } else {
                // Update candle
                const updatedCandle: CandleData = {
                    time: currentCandle.time,
                    open: currentCandle.open,
                    high: Math.max(currentCandle.high, midPrice),
                    low: Math.min(currentCandle.low, midPrice),
                    close: midPrice,
                    volume: currentCandle.volume + volumeDelta,
                };
                setCurrentCandle(updatedCandle);
                resolverRef.current(updatedCandle);
            }
        }
    };

    const next = (): Promise<CandleData | null> => {
        return new Promise((resolve) => {
            if (messageQueueRef.current.length > 0) {
                processQueue();
            } else {
                resolverRef.current = (candle: CandleData) => {
                    resolve(candle);
                    resolverRef.current = null;
                };
            }
        });
    };

    const close = () => {
        if (connectionRef.current) {
            connectionRef.current.invoke('Unsubscribe', [ticker]).catch(() => {});
            connectionRef.current.stop();
        }
    };

    return { next, close };
}
