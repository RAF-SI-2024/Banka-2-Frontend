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

interface TradingChartProps {
    type?: 'candle' | 'volume';
    onTimeRangeChanged?: (range: { from: number; to: number }) => void;
    setTimeScaleRef?: (timeScale: any) => void;
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

export default function TradingChart({
    type = 'candle',
    onTimeRangeChanged,
    setTimeScaleRef
}: TradingChartProps) {
    const { theme } = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<CandleData[]>([]);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Histogram'> | null>(null);

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
                attributionLogo: type === "volume",
            },
            grid: {
                vertLines: { color: colors.grid },
                horzLines: { color: colors.grid },
            },
            rightPriceScale: {
                // Force the same width for price scales
                borderVisible: false,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            timeScale: {
                visible: true,
                borderVisible: true,
            },
            autoSize: true,
        });

        // Create series based on type
        if (type === 'candle') {
            seriesRef.current = chart.addSeries(CandlestickSeries, {
                upColor: colors.up,
                downColor: colors.down,
                borderVisible: false,
                wickUpColor: colors.up,
                wickDownColor: colors.down,
            });
        } else {
            seriesRef.current = chart.addSeries(HistogramSeries, {
                color: colors.volume,
                priceFormat: { type: 'volume' },
            });
        }

        // This is the key part - correctly share the timeScale
        if (setTimeScaleRef) {
            const timeScale = chart.timeScale();
            // Wrap the timeScale in an object that exposes only the methods we need
            setTimeScaleRef({
                setVisibleLogicalRange: (range: { from: number; to: number }) => {
                    timeScale.setVisibleLogicalRange({
                        from: range.from,
                        to: range.to
                    });
                },
                // Add other methods you might need
            });
        }

        // Set up sync listener if needed
        if (onTimeRangeChanged) {
            chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
                if (range) {
                    onTimeRangeChanged({
                        from: range.from,
                        to: range.to
                    });
                }
            });
        }

        chartRef.current = chart;

        return () => {
            chartRef.current?.remove();
            chartRef.current = null;
        };
    }, [theme]);

    // Method to update time scale
    const updateTimeRange = useRef((range: { from: number; to: number }) => {
        if (chartRef.current) {
            chartRef.current.timeScale().setVisibleRange({
                from: range.from as Time,
                to: range.to as Time
            });
        }
    });

    // Expose the updateTimeRange method
    useEffect(() => {
        return () => {
            // Cleanup
        };
    }, [updateTimeRange]);

    // Update data when it changes
    useEffect(() => {
        if (!seriesRef.current || chartData.length === 0) return;

        if (type === 'candle') {
            (seriesRef.current as ISeriesApi<'Candlestick'>).setData(
                chartData.map(formatCandle)
            );
        } else {
            (seriesRef.current as ISeriesApi<'Histogram'>).setData(
                chartData.map(formatVolume)
            );
        }
    }, [chartData, type, theme]);

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