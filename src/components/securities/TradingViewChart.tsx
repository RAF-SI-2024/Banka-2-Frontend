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
} from "@/components/securities/ChartUtils.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";
import {
    Datafeed,
    generateRealtimeData, getNextRealtimeUpdate,
} from "@/mocks/GraphMock.tsx";


interface TradingChartProps {
    title: string;
    className?: string;
}


export default function TradingViewChart({ title, className }: TradingChartProps) {
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

    const datafeed = new Datafeed();


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
            priceFormat: {type: 'price', precision: 5},
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

        const data = datafeed.getBars(200);
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
                const formattedPrice = formatCurrency(price, "RSD");

                setLegendName(title);
                setLegendPrice(formattedPrice);
                setLegendTime(time);
            };

            chartRef.current.subscribeCrosshairMove(updateLegend);

            updateLegend(undefined);
        }

        if(chartRef.current) {
            chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(logicalRange => {
                if (logicalRange && logicalRange.from < 10) {
                    // load more data
                    const numberBarsToLoad = 50 - logicalRange.from;
                    const data = datafeed.getBars(numberBarsToLoad);
                    setTimeout(() => {
                        setChartData(data);

                    }, 250); // add a loading delay
                }
            });
        }

        const lastCandle = data[data.length - 1];
        const { realtimeUpdates } = generateRealtimeData(lastCandle.close, 20, 1000);
        const streamingDataProvider = getNextRealtimeUpdate(realtimeUpdates);
        let lastCandleTime: number = -1;

        const intervalID = setInterval(() => {
            const update = streamingDataProvider.next();
            if (update.done) {
                clearInterval(intervalID);
                return;
            }



            setLegendPrice(formatCurrency(update.value.close, "RSD"));
            setLegendTime(new Date(update.value.time * 1000).toLocaleString("sr-RS"));

            // Update candlestick and volume series
            candleSeriesRef.current?.update(update.value);
            volumeSeriesRef.current?.update({
                time: update.value.time,
                value: update.value.volume,
            });

            if (candleSeriesRef.current && maSeriesRef.current && lastCandleTime !== update.value.time) {
                // New candle detected → recalculate MA
                if(lastCandleTime > 0) {
                    const maData = calculateMovingAverageSeriesData(candleSeriesRef.current.data(), 20);
                    maSeriesRef.current.setData(maData);
                }
                lastCandleTime = update.value.time;
            }



        }, 250);



        return () => {
            // Clean up all chart instances
            chartRef.current?.remove();
            chartRef.current = null;
            clearInterval(intervalID);
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









    return (
        <div ref={chartContainerRef} className={cn("relative size-full transition-colors", className)} >
            <div className="absolute left-3 top-2 z-10 font-paragraph text-chart-legend">
                <div className="font-semibold text-xl">{legendName}</div>
                <div className="text-base">{legendPrice}</div>
                <div className="text-sm font-light">{legendTime}</div>
            </div>
        </div>
    );
}