'use client';

import { Badge } from '@/components/ui/badge';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
    desktop: {
        label: 'Spent',
        color: 'var(--chart-1)',
    },
    mobile: {
        label: 'Earned',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const constructChartValues = (transactions: ITransaction[], hiddenBars: string[]) => {
    const data: IGroupedTransactions = {};
    transactions.forEach((t) => {
        if (hiddenBars.includes(t.valueDate)) return;

        if (!data[t.valueDate])
            data[t.valueDate] = { income: 0, spending: 0, day: new Date(t.valueDate).getDate() };

        const amount = Number(t.transactionAmount.amount);
        if (amount > 0) data[t.valueDate].income += amount;
        else data[t.valueDate].spending -= amount;
    });

    return Object.keys(data)
        .map((dateKey) => {
            return {
                date: dateKey,
                ...data[dateKey],
            };
        })
        .sort((a, b) => a.day - b.day);
};

export function Chart({ transactions }: { transactions: ITransaction[] }) {
    const [displayedItem, setDisplayedItem] = useState<'spending' | 'income'>('spending');
    const [hiddenBars, setHiddenBars] = useState<string[]>([]);

    const chartValues = useMemo(
        () => constructChartValues(transactions, hiddenBars),
        [hiddenBars, transactions]
    );

    const handleValueChange = (value: string) => {
        setHiddenBars([]);
        setDisplayedItem(value as 'spending' | 'income');
    };

    return (
        <>
            <div className="mb-auto flex justify-between items-center">
                <Select onValueChange={handleValueChange} defaultValue="spending">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="spending">Spending</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex">
                    {hiddenBars.length ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => setHiddenBars([])}
                                >
                                    <span className="text-sm">Filtered:</span>
                                    <Badge
                                        className="h-4 w-4 rounded-full  font-mono tabular-nums"
                                        variant="outline"
                                    >
                                        {hiddenBars.length}
                                    </Badge>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset filter</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : undefined}
                </div>
            </div>
            <ChartContainer config={chartConfig} className="min-h-0">
                <BarChart accessibilityLayer data={chartValues.filter((v) => v[displayedItem] !== 0)}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" text="Click bar to hide" />}
                    />
                    {displayedItem === 'income' && (
                        <Bar
                            dataKey="income"
                            fill="var(--color-desktop)"
                            radius={4}
                            onClick={(data) => setHiddenBars((prev) => [...prev, data.date])}
                            className="cursor-pointer"
                        >
                            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                        </Bar>
                    )}
                    {displayedItem === 'spending' && (
                        <Bar
                            dataKey="spending"
                            fill="var(--color-mobile)"
                            radius={4}
                            onClick={(data) => setHiddenBars((prev) => [...prev, data.date])}
                            className="cursor-pointer"
                        />
                    )}
                </BarChart>
            </ChartContainer>
        </>
    );
}
