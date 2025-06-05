import {useState, useEffect, useRef, useMemo, useCallback, useImperativeHandle, forwardRef} from 'react';
import {
    CandlestickSeries,
    createChart, createTextWatermark,
    HistogramSeries,
    IChartApi,
    ISeriesApi, LineData, LineSeries,
    Time,
    UTCTimestamp
} from 'lightweight-charts';
import { useTheme } from "@/components/__utils__/theme-provider.tsx";
import {cn} from "@/lib/utils.ts";
import {
    calculateMovingAverageSeriesData, CandleData,
    getCandlestickColors,
    getChartColors,
    getChartOptions,
    getMAColors, getVolumeColors, getWatermarkOptions
} from "@/components/trading/ChartUtils.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";

import { Button } from '../ui/button';
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {QuoteDailySimpleResponse, QuoteSimpleResponse, Security, SecurityType} from '@/types/exchange/security';
import {Datafeed} from "@/components/trading/TradingViewChartFunctions.ts";
import {Currency} from "@/types/bank_user/currency.ts";
import { CandleGenerator } from '@/hooks/use-candle-data';

interface TradingChartProps {
    className?: string;
    ticker: string;
    quotes: QuoteDailySimpleResponse[],
    currency: Currency,
    interval?: number; // Add interval prop with default
    datafeed: Datafeed,
    generator: CandleGenerator | null,
}
export type TradingChartRef = {
    onMessage: (quote: QuoteSimpleResponse) => void;
};

const TradingViewChart = (
    {
        currency,
        ticker,
        quotes,
        className,
        datafeed,
        generator,
        ...props
    }: TradingChartProps,
) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isUpdatingRef = useRef(false);

    const [chartData, setChartData] = useState<CandleData[]>([]);

    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    const [legendPrice, setLegendPrice] = useState<string>();
    const [legendTime, setLegendTime] = useState<string>();
    const [legendName, setLegendName] = useState<string>();

    // on neew data
    // useImperativeHandle(ref, () => ({
    //     onMessage: (quote: QuoteSimpleResponse) => {
    //         console.log('Received quote:', quote);
    //         // You can update state, redraw the chart, etc. here
    //     }
    // })); //TODO implement onMessage via queue





    // Cleanup function
    const cleanup = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if(generator)
            generator.close();

        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        // Clear all series refs
        candleSeriesRef.current = null;
        volumeSeriesRef.current = null;
        maSeriesRef.current = null;
    }, [generator]);

    // Chart initialization
    useEffect(() => {
        if (!chartContainerRef.current || chartRef.current) return;

        const colors = getChartColors(theme);
        const options = getChartOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            colors: colors
        });

        // Create candle chart
        const chart = createChart(chartContainerRef.current, options);

        // Create series
        candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
            ...getCandlestickColors(colors),
            priceFormat: {
                type: 'custom',
                minMove: 0.01,
                formatter: (price: number) => formatCurrency(price, currency.code)
            },
        }, 0);

        maSeriesRef.current = chart.addSeries(LineSeries, {
            ...getMAColors(colors),
            lineWidth: 2,
        }, 0)

        volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
            ...getVolumeColors(colors),
            priceFormat: { type: 'volume' },
        }, 1);

        const volumePane = chart.panes()[1];
        volumePane.setHeight(80);

        chartRef.current = chart;

        createTextWatermark(chart.panes()[0], getWatermarkOptions(colors));

        const data = datafeed.getBars();

        // Initialize chart data
        const candleData = data.map(d => ({
            time: d.time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close
        }))

        const volumeData = data.map(d => ({
            time: d.time as Time,
            value: d.volume,
            color: colors.volume
        }))

        candleSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);

        const maData = calculateMovingAverageSeriesData(candleSeriesRef.current.data(), 20);
        maSeriesRef.current.setData(maData);

        // Setup legend
        const updateLegend = (param: any) => {
            const validCrosshairPoint = !(
                param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0
            );
            const bar = validCrosshairPoint ? param.seriesData.get(candleSeriesRef.current) : candleData[candleData.length-1];

            if (!bar) return;

            const time = (new Date(bar.time * 1000)).toLocaleString("sr-RS");
            const price = bar.value !== undefined ? bar.value : bar.close;
            const formattedPrice = formatCurrency(price, currency.code);

            setLegendName(ticker);
            setLegendPrice(formattedPrice);
            setLegendTime(time);
        };

        chartRef.current.subscribeCrosshairMove(updateLegend);
        updateLegend(undefined);

        return cleanup;
    }, [theme, ticker, currency.code, datafeed, generator, cleanup]);

    // Update data when chartData changes
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current
            || !chartRef.current || chartData.length === 0
            || !maSeriesRef.current) return;

        const colors = getChartColors(theme);

        const candleData = chartData.map(d => ({
            time: d.time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close
        }))

        const volumeData = chartData.map(d => ({
            time: d.time as Time,
            value: d.volume,
            color: colors.volume
        }))

        candleSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);

        const maData = calculateMovingAverageSeriesData(candleSeriesRef.current.data(), 20);
        maSeriesRef.current.setData(maData);

    }, [chartData, theme]);

    // Update theme colors
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current
            || !chartRef.current || !maSeriesRef.current) return;

        const colors = getChartColors(theme);

        // Update chart options
        chartRef.current.applyOptions(getChartOptions({colors: colors}));

        // Update series colors
        candleSeriesRef.current.applyOptions(getCandlestickColors(colors));
        volumeSeriesRef.current.applyOptions(getVolumeColors(colors));
        maSeriesRef.current.applyOptions(getMAColors(colors));
    }, [theme]);

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    // Time scale buttons
    const setTimeScale = useCallback((option: string) => {
        if (!chartRef.current) return;

        const formatDate = (date: Date): string => {
            return date.toISOString().slice(0, 10);
        };

        const dateTo = new Date();
        let dateFrom = new Date();

        switch(option.toUpperCase()){
            case "1D":
                dateFrom.setDate(dateTo.getDate() - 1);
                break;
            case "1W":
                dateFrom.setDate(dateTo.getDate() - 7);
                break;
            case "1M":
                dateFrom.setMonth(dateTo.getMonth() - 1);
                break;
            case "1Y":
                dateFrom.setFullYear(dateTo.getFullYear() - 1);
                break;
            default:
                return;
        }

        chartRef.current.timeScale().setVisibleRange({
            from: formatDate(dateFrom),
            to: formatDate(dateTo),
        });
    }, []);

    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-[400px] p-0">
                <div ref={chartContainerRef} className={cn("relative size-full transition-colors", className)}>
                    <div className="absolute left-3 top-2 z-10 font-paragraph text-chart-legend">
                        <div className="font-semibold text-xl">{legendName}</div>
                        <div className="text-base">{legendPrice}</div>
                        <div className="text-sm font-light">{legendTime}</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="h-10 flex-row pl-0 pb-0">
                <Button variant='ghost' onClick={() => setTimeScale('1D')} className="text-link hover:text-muted-foreground">1D</Button>
                <Button variant='ghost' onClick={() => setTimeScale('1W')} className="text-link hover:text-muted-foreground">1W</Button>
                <Button variant='ghost' onClick={() => setTimeScale('1M')} className="text-link hover:text-muted-foreground">1M</Button>
                <Button variant='ghost' onClick={() => setTimeScale('1Y')} className="text-link hover:text-muted-foreground">1Y</Button>
            </CardFooter>
        </Card>
    );
};

export default TradingViewChart;