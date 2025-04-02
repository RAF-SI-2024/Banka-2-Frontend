import {
    CandlestickData,
    ChartOptions, createTextWatermark,
    DeepPartial,
    LineData,
    LineStyle,
    LineWidth, TextWatermarkOptions,
    Time,
    TimeChartOptions, WhitespaceData
} from "lightweight-charts";
import {formatCurrency} from "@/lib/format-currency.ts";

export interface ColorProps{
    text: string;
    grid: string;
    up: string;
    down: string;
    volume: string;
    ma: string,
    crosshair: string;
    croshair_line:string;
    separator: string;
    separator_hover:string;
    watermark: string;
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

export const getChartColors = (theme: 'light' | 'dark' | 'system'): ColorProps => {
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
        volume: getComputedStyle(root).getPropertyValue(isDark ? '--chart-volume-dark' : '--chart-volume-light'),
        crosshair: getComputedStyle(root).getPropertyValue(isDark ? '--chart-crosshair-dark' : '--chart-crosshair-light'),
        croshair_line: getComputedStyle(root).getPropertyValue(isDark ? '--chart-crosshair-line-dark' : '--chart-crosshair-line-light'),
        watermark: getComputedStyle(root).getPropertyValue(isDark ? '--chart-watermark-dark' : '--chart-watermark-light'),
        separator: getComputedStyle(root).getPropertyValue(isDark ? '--chart-separator-dark' : '--chart-separator-light'),
        separator_hover: getComputedStyle(root).getPropertyValue(isDark ? '--chart-separator-hover-dark' : '--chart-separator-hover-light'),
        ma: getComputedStyle(root).getPropertyValue(isDark ? '--chart-ma-dark' : '--chart-ma-light'),
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
                separatorColor: colors.separator,
                separatorHoverColor: colors.separator_hover,
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
            visible: true,
            borderVisible: false,
            allowBoldLabels: false,
        },
        localization:{
            // locale: "sr-RS", ruzno je na cirilici zato je zakomentarisano
        },
        autoSize: true,
        crosshair:{
            vertLine: {
                color: colors.croshair_line,
                style: LineStyle.Dashed,
                labelBackgroundColor: colors.crosshair,
            },

            // Horizontal crosshair line (showing Price in Label)
            horzLine: {
                color: colors.croshair_line,
                style: LineStyle.Solid,
                labelBackgroundColor: colors.crosshair,
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
        color: colors.ma,
    })
}

export function getVolumeColors(colors: ColorProps) {
    return({
        color: colors.volume,
    })
}

export function getWatermarkOptions(colors: ColorProps): DeepPartial<TextWatermarkOptions> {
    return({
        horzAlign: 'center',
        vertAlign: 'center',
        lines: [
            {
                fontFamily: "Poppins",
                text: 'BankToo',
                color: colors.watermark,
                fontSize: 36,
            },
        ],
    })
}

export function calculateMovingAverageSeriesData(
    data: readonly (CandlestickData | WhitespaceData)[],
    period: number
): LineData[] {
    if (data.length < period) return [];

    return data.map((candle, index): LineData => {
        const start = Math.max(0, index - period + 1);
        const subset = data.slice(start, index + 1);

        // Ensure only valid CandlestickData (ignore WhitespaceData)
        const sum = subset.reduce((acc, item) => acc + ("close" in item ? item.close : 0), 0);

        return {
            time: candle.time as Time,
            value: sum / subset.length
        };
    });
}
