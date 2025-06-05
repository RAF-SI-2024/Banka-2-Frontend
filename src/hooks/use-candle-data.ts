import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_SOCKET } from '@/constants/endpoints.ts';
import {QuoteSimpleResponse} from "@/types/exchange/security.ts";


export interface CandleGenerator {
    close: () => void;
}

export function useRealtimeCandleGenerator(ticker: string): CandleGenerator {
    const messageQueueRef = useRef<QuoteSimpleResponse[]>([]);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_SOCKET}/security-hub`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true,
            })
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
            // TODO: add message processing
        });


    }, [ticker]);

    const close = () => {
        if (connectionRef.current) {
            connectionRef.current.invoke('Unsubscribe', [ticker]).catch(() => {});
            // connectionRef.current.stop();
        }
    };

    return {  close };
}
