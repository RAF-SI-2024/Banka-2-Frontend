import { useState, useEffect, useRef } from 'react';
import {
    CandlestickSeries,
    createChart, createImageWatermark, createTextWatermark,
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
    getMAColors, getVolumeColors
} from "@/components/securities/ChartUtils.tsx";
import {formatCurrency} from "@/lib/format-currency.ts";


interface TradingChartProps {
    title: string;
    className?: string;
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


export default function SynchronizedTradingChart({ title, className }: TradingChartProps) {
    const { theme } = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    const [chartData, setChartData] = useState<CandleData[]>([]);
    const [madData, setMaData] = useState<any>([]);

    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    const [legendPrice, setLegendPrice] = useState<string>();
    const [legendTime, setLegendTime] = useState<string>();
    const [legendName, setLegendName] = useState<string>();



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
            priceFormat: {type: 'price', precision: 5}
        });

        maSeriesRef.current = chart.addSeries(LineSeries, {
            ...getMAColors(colors),
            lineWidth: 2,
        })

        volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
            ...getVolumeColors(colors),
            priceFormat: { type: 'volume' },
        }, 1);

        // fetch initial data
        const mockData = generateMockData();
        setChartData(mockData);
        const maData = calculateMovingAverageSeriesData(mockData, 10)
        setMaData(maData);

        const volumePane = chart.panes()[1];
        volumePane.setHeight(80);


        // chart.timeScale().fitContent(); // TODO

        chartRef.current = chart;

        // LEGEND
        // @ts-ignore
        const updateLegend = param => {
            const validCrosshairPoint = !(
                param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0
            );
            //const bar = validCrosshairPoint ? param.seriesData.get(candleSeriesRef.current) : getLastBar(candleSeriesRef.current);
            // time is in the same format that you supplied to the setData method,
            // which in this case is YYYY-MM-DD
            const rawTime = validCrosshairPoint
                ? param.seriesData.get(candleSeriesRef.current).time
                : mockData[mockData.length - 1].time;

            // Convert `rawTime` to a JavaScript Date object
            const time = new Date(rawTime * 1000).toLocaleString("sr-RS");

            const price = validCrosshairPoint ? (param.seriesData.get(candleSeriesRef.current).value ?
                param.seriesData.get(candleSeriesRef.current).value: param.seriesData.get(candleSeriesRef.current).close)
                : mockData[mockData.length-1].close;
            const formattedPrice = formatCurrency(price, "RSD");

            setLegendName(title);
            setLegendPrice(formattedPrice);
            setLegendTime(time);
        };

        chart.subscribeCrosshairMove(updateLegend);

        updateLegend(undefined);

        createTextWatermark(chart.panes()[0], {
            horzAlign: 'center',
            vertAlign: 'center',
            lines: [
                {
                    fontFamily: "Poppins",
                    text: 'BankToo',
                    color: colors.grid,
                    fontSize: 36,
                },
            ],
        });

        return () => {
            // Clean up all chart instances
            chartRef.current?.remove();
            chartRef.current = null;
        };
    }, []);




    // Update data when it changes
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current
            || !chartRef.current || chartData.length === 0
            || !maSeriesRef.current) return;

        const colors = getChartColors(theme);

        // Update chart options
        chartRef.current.applyOptions(getChartOptions({colors: colors}));


        // Update series colors
        candleSeriesRef.current.applyOptions(getCandlestickColors(colors));
        volumeSeriesRef.current.applyOptions(getVolumeColors(colors));
        maSeriesRef.current.applyOptions(getMAColors(colors));

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

        const maData = calculateMovingAverageSeriesData(chartData, 10);

        candleSeriesRef.current.setData(candleData);

        volumeSeriesRef.current.setData(volumeData);

        maSeriesRef.current.setData(maData);

        if (maSeriesRef.current) {
            maSeriesRef.current.setData(madData);
        }

    }, [theme, chartData, madData]);





    return (
        <div ref={chartContainerRef} className={cn("relative size-full transition-colors", className)} >
            <div className="absolute left-3 top-2 z-10 font-paragraph text-muted-foreground">
                <div className="font-semibold text-xl">{legendName}</div>
                <div className="text-base">{legendPrice}</div>
                <div className="text-sm font-light">{legendTime}</div>
            </div>
        </div>
    );
}