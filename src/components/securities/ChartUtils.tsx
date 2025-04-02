import {ChartOptions, DeepPartial, LineData, LineStyle, LineWidth, Time, TimeChartOptions} from "lightweight-charts";

export interface ColorProps{
    text: string;
    grid: string;
    up: string;
    down: string;
    volume: string;
}

interface ChartOptionsProps{
    width?: number;
    height?: number;
    colors: ColorProps;
}

export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export const getChartColors = (theme: 'light' | 'dark' | 'system') => {
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


export function getChartOptions  ({width, height, colors}: ChartOptionsProps): DeepPartial<TimeChartOptions>  {

    return ({
        width: width,
        height: height,
        layout: {
            background: { color: 'transparent' },
            textColor: colors.text,
            fontFamily: "Lexend",
            panes: {
                separatorColor: '#f22c3d', // TODO
                separatorHoverColor: 'rgba(255, 0, 0, 0.1)', // TODO
                enableResize: true,
            }
        },
        grid: {
            vertLines: { color: colors.grid },
            horzLines: { color: colors.grid },
        },
        rightPriceScale: {
            scaleMargins: {
                top: 0.1,
                bottom: 0,
            },
            minimumWidth: 100,

        },
        timeScale: {
            visible: false,
            borderVisible: false,
            allowBoldLabels: false
        },
        localization:{
            locale:"sr-RS"
        },
        autoSize: true,
        crosshair:{
            vertLine: {
                width: 8 as DeepPartial<LineWidth>,
                color: '#C3BCDB44', // TODO
                style: LineStyle.Solid,
                // labelBackgroundColor: colors., // TODO
            },

            // Horizontal crosshair line (showing Price in Label)
            horzLine: {
                color: '#9B7DFF', // TODO
                labelBackgroundColor: '#9B7DFF', // TODO
            },

        },
    })
}

export function getCandlestickColors(colors: ColorProps) {
    return({
        upColor: colors.up,
        downColor: colors.down,
        borderVisible: false,
        wickUpColor: colors.up,
        wickDownColor: colors.down,
    })
}

export function getMAColors(colors: ColorProps) {
    return({
        color: colors.volume,
    })
}

export function getVolumeColors(colors: ColorProps) {
    return({
        color: colors.volume,
    })
}


export function calculateMovingAverageSeriesData(
    data: CandleData[],
    period: number
): LineData[] {
    if (data.length < period) return [];

    return data.map((candle, index): LineData<Time> => {
        const start = Math.max(0, index - period + 1);
        const subset = data.slice(start, index + 1);
        const sum = subset.reduce((acc, item) => acc + item.close, 0);
        return {
            time: candle.time as Time,
            value: sum / subset.length
        };
    });
}
