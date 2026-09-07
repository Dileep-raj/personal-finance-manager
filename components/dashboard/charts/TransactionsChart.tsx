"use client"

import { useState, useMemo, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { getTransactionsFromLast30Days } from "@/lib/actions/transaction"

const chartConfig = {
    credit: {
        label: "Credit",
        color: "var(--chart-2)",
    },
    debit: {
        label: "Debit",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig


const TransactionsChart = () => {
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("debit")
    const [transactionsData, setTransactionsData] = useState<{ credit: number, debit: number, date: string }[]>([])

    useEffect(() => {
        const fetchTransactionsData = async () => {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const data = await getTransactionsFromLast30Days(timezone)
            if (data.success) setTransactionsData(data.data || [])
        }
        fetchTransactionsData()
    }, [])

    const total = useMemo(() => ({
        credit: transactionsData.reduce((acc, curr) => acc + curr.credit, 0),
        debit: transactionsData.reduce((acc, curr) => acc + curr.debit, 0),
    }), [transactionsData])

    return (
        <div className="flex flex-col justify-center items-center">
            <Card className="py-0 w-10/12">
                <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Total transactions in the last 30 days
                        </CardDescription>
                    </div>
                    <div className="flex">
                        {["credit", "debit"].map((key) => {
                            const chart = key as keyof typeof chartConfig
                            return (
                                <button key={chart} type="button" data-active={activeChart === chart} onClick={() => setActiveChart(chart)}
                                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                >
                                    <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                                    <span className="text-lg leading-none font-bold sm:text-3xl">{total[key as keyof typeof total].toLocaleString()}</span>
                                </button>
                            )
                        })}
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
                        <BarChart accessibilityLayer data={transactionsData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip content={
                                <ChartTooltipContent className="w-37.5" nameKey={activeChart}
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                            />
                            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={[6, 6, 2, 2]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsChart;