import { useState, useEffect, useRef } from 'react';
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


interface TradingChartProps {
    className?: string;
    ticker: string;
    quotes: QuoteDailySimpleResponse[],
    currency: Currency,
}



export default function TradingViewChart({ currency, ticker, quotes, className, ...props }: TradingChartProps) {


    const { theme } = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    const [chartData, setChartData] = useState<CandleData[]>([]);

    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    const [legendPrice, setLegendPrice] = useState<string>();
    const [legendTime, setLegendTime] = useState<string>();
    const [legendName, setLegendName] = useState<string>();

    const datafeed = new Datafeed(quotes);

    // const generator = useRealtimeCandleGenerator(ticker, 60_000);



    // First time init
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
        // update data
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

        // LEGEND


        if (chartRef.current) {
            // @ts-ignore
            const updateLegend = param => {
                const validCrosshairPoint = !(
                    param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0
                );
                const bar = validCrosshairPoint ? param.seriesData.get(candleSeriesRef.current) : candleData[candleData.length-1];;
                // time is in the same format that you supplied to the setData method,
                // which in this case is YYYY-MM-DD
                // Convert `rawTime` to a JavaScript Date object
                const time = (new Date(bar.time*1000)).toLocaleString("sr-RS");
                const price = bar.value !== undefined ? bar.value : bar.close;
                const formattedPrice = formatCurrency(price, currency.code);

                setLegendName(ticker);
                setLegendPrice(formattedPrice);
                setLegendTime(time);
            };

            chartRef.current.subscribeCrosshairMove(updateLegend);

            updateLegend(undefined);
        }


        const lastCandle = data[data.length - 1];
        let lastCandleTime: number = -1;

        // const intervalID =  setInterval(async () => {
        //     const update = await generator.next();
        //     if(update == null)
        //         return;
        //
        //
        //     setLegendPrice(formatCurrency(update.close, "RSD"));
        //     setLegendTime(new Date(update.time * 1000).toLocaleString("sr-RS"));
        //
        //     // Update candlestick and volume series
        //     candleSeriesRef.current?.update({
        //         time: update.time as UTCTimestamp,
        //         open: update.open,
        //         high: update.high,
        //         low: update.low,
        //         close: update.close
        //     });
        //     volumeSeriesRef.current?.update({
        //         time: update.time as UTCTimestamp,
        //         value: update.volume,
        //     });
        //
        //     if (candleSeriesRef.current && maSeriesRef.current && lastCandleTime !== update.time) {
        //         // New candle detected → recalculate MA
        //         if(lastCandleTime > 0) {
        //             const maData = calculateMovingAverageSeriesData(candleSeriesRef.current.data(), 20);
        //             maSeriesRef.current.setData(maData);
        //         }
        //         lastCandleTime = update.time;
        //     }
        //
        //
        //
        // }, 250);





        return () => {
            // Clean up all chart instances
            chartRef.current?.remove();
            chartRef.current = null;
            // clearInterval(intervalID);
        };
    }, []);




    // Update data when it changes
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current
            || !chartRef.current || chartData.length === 0
            || !maSeriesRef.current) return;


        const colors = getChartColors(theme);
        // update data
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

    }, [chartData]);

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


    // time scale Buttons
    function setTimeScale(option:string){
        if(!chartRef.current)
            return;

        function formatDate(date: Date): string {
            return date.toISOString().slice(0, 10);
        }
        //
        const dateTo = new Date(); // today
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
    }



    return (
        <Card className={cn("border-0 h-full w-full", className)} {...props}>
            <CardContent className="h-[400px] p-0" >
                <div ref={chartContainerRef} className={cn("relative size-full transition-colors", className)} >
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
}


