"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {cn} from "@/lib/utils.ts";
import {formatCurrency} from "@/lib/format-currency.ts";
import {useMediaQuery} from "@/hooks/use-media-query.ts";



interface RadialChartProps extends React.ComponentProps<"div">{
    title?: string,
    available_balance: number,
    total_balance: number,
    currencyCode: string
}
export function RadialChart({title="Total balance", available_balance, total_balance, currencyCode, className, ...props}: RadialChartProps) {

    const isDesktop = useMediaQuery("(min-width: 800px)");

    const chartConfig = {

        available_balance: {
            label: `Available balance (${currencyCode}):    `,
            color: "var(--primary)",
        },
        reserved_funds: {
            label: `Reserved funds (${currencyCode}):     `,
            color: "var(--muted)",
        },
    } satisfies ChartConfig

    return (
                <ChartContainer
                    config={chartConfig}
                    className={cn("mx-auto aspect-square  min-w-[236px] -mb-[118px] font-paragraph", className)} {...props}
                >
                    <RadialBarChart
                        data={[{available_balance: available_balance, reserved_funds: total_balance - available_balance}]}
                        endAngle={180}
                        innerRadius={100}
                        outerRadius={190}
                        className="z-0"
                    >
                        <ChartTooltip
                            cursor={false}
                            trigger={isDesktop? "hover" : "click"}
                            content={<ChartTooltipContent hideLabel/>}

                            formatter={(value: number) => formatCurrency(value, currencyCode)}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className={"fill-foreground font-heading font-bold"}
                                                    style={{ fontSize: `${16/formatCurrency(available_balance, currencyCode).length }rem` }}
                                                >
                                                    {formatCurrency(available_balance, currencyCode)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground "
                                                >
                                                    {title}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="available_balance"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-primary)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="reserved_funds"
                            fill="var(--color-muted)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>

    )
}
