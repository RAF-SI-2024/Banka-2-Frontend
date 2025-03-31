import { useState, useEffect, useRef } from 'react';
import {
    CandlestickSeries,
    createChart,
    HistogramSeries,
    IChartApi,
    ISeriesApi,
    Time,
    UTCTimestamp
} from 'lightweight-charts';
import { useTheme } from "@/components/__utils__/theme-provider.tsx"

interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const generateMockData = (): CandleData[] => {
    const initialPrice = 100;
    const data: CandleData[] = [];
    let previousClose = initialPrice;

    for (let i = 0; i < 30; i++) {
        const date = new Date(2025, 0, i + 1);
        const time = (date.getTime() / 1000) as UTCTimestamp; // Explicit cast
        const open = previousClose;
        const close = open + (Math.random() - 0.5) * 10;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        const volume = Math.floor(Math.random() * 1000000);

        data.push({
            time,
            open,
            high,
            low,
            close,
            volume,
        });

        previousClose = close;
    }

    return data;
};

const getChartColors = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    const isDark = theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : theme === 'dark';

    return {
        text: isDark
            ? getComputedStyle(root).getPropertyValue('--chart-foreground-dark')
            : getComputedStyle(root).getPropertyValue('--chart-foreground-light'),
        grid: isDark
            ? getComputedStyle(root).getPropertyValue('--chart-grid-dark')
            : getComputedStyle(root).getPropertyValue('--chart-grid-light'),
        up: getComputedStyle(root).getPropertyValue(isDark ? '--chart-up-dark' : '--chart-up-light'),
        down: getComputedStyle(root).getPropertyValue(isDark ? '--chart-down-dark' : '--chart-down-light'),
        volume: getComputedStyle(root).getPropertyValue(isDark ? '--chart-volume-light' : '--chart-volume-dark'),
    };
};

export default function TradingChart() {
    const { theme } = useTheme(); // Your theme management
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<CandleData[]>([]);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);


    useEffect(() => {
        if (!chartContainerRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            chartRef.current?.applyOptions({
                width: chartContainerRef.current?.clientWidth,
                height: chartContainerRef.current?.clientHeight
            });
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Initialize chart
    useEffect(() => {
        if (!chartRef.current || !candleSeriesRef.current || !volumeSeriesRef.current) return;

        const colors = getChartColors(theme);

        // Update chart options
        chartRef.current.applyOptions({
            layout: { textColor: colors.text },
            grid: {
                vertLines: { color: colors.grid },
                horzLines: { color: colors.grid }
            }
        });

        // Update series colors
        candleSeriesRef.current.applyOptions({
            upColor: colors.up,
            downColor: colors.down,
            wickUpColor: colors.up,
            wickDownColor: colors.down
        });

        volumeSeriesRef.current.applyOptions({
            color: colors.volume
        });

        // Refresh data with new colors
        if (chartData.length > 0) {
            candleSeriesRef.current.setData(chartData.map(formatCandle));
            volumeSeriesRef.current.setData(chartData.map(formatVolume));
        }
    }, [theme, chartData]); // Add theme as dependency

    // Initialize chart once
    useEffect(() => {
        if (!chartContainerRef.current || chartRef.current) return;

        const colors = getChartColors(theme);
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { color: 'transparent' },
                textColor: colors.text,
                fontFamily: "var(--font-paragraph)",
            },
            grid: {
                vertLines: { color: colors.grid },
                horzLines: { color: colors.grid },
            },
            autoSize: true,
        });

        candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
            upColor: colors.up,
            downColor: colors.down,
            borderVisible: false,
            wickUpColor: colors.up,
            wickDownColor: colors.down,
        });

        volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
            color: colors.volume,
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });

        volumeSeriesRef.current.priceScale().applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });

        chartRef.current = chart;

        return () => {
            chartRef.current?.remove();
            chartRef.current = null;
        };
    }, []);


    const formatCandle = (d: CandleData) => ({
        time: d.time as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
    });

    const formatVolume = (d: CandleData) => ({
        time: d.time as Time,
        value: d.volume,
        color: getChartColors(theme).volume
    });


    // Fetch initial data
    useEffect(() => {
        // TODO: Replace with API call
        const mockData = generateMockData();
        setChartData(mockData);
    }, []);

    const handleRefresh = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('your-api-endpoint');
            // const data = await response.json();
            const mockData = generateMockData();
            setChartData(mockData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (

            <div ref={chartContainerRef} className="size-full transition-colors" />

    );
}