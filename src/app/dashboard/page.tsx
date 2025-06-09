'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { getTransactions } from './_actions';
import Card from './card';
import { Chart } from './chart';
import StatCard from './statCard';
import { TransactionList } from './transactionList';

const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
];

const years = ['2024', '2025', '2026'];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export default function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedAccount, setSelectedAccount] = useState<number>(0);
    const [transactions, setTransactions] = useState<{ isLoading: boolean; data: ITransaction[] }>({
        isLoading: true,
        data: [],
    });

    useEffect(() => {
        const getTransactionData = async () => {
            try {
                setTransactions({ isLoading: true, data: [] });
                const transactions = await getTransactions(selectedMonth + 1, selectedYear, selectedAccount);

                setTransactions({ isLoading: false, data: transactions });
            } catch (err) {
                console.log(err);
                setTransactions({ isLoading: false, data: [] });
            }
        };

        if (selectedMonth) getTransactionData();
    }, [selectedMonth, selectedYear, selectedAccount]);

    const earned = useMemo(
        () =>
            transactions.data
                .filter((t) => t.transactionAmount.amount > 0)
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0)
                .toFixed(2),
        [transactions.data]
    );

    const spent = useMemo(
        () =>
            transactions.data
                .filter((t) => t.transactionAmount.amount < 0)
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0)
                .toFixed(2),
        [transactions.data]
    );

    const total = useMemo(
        () =>
            transactions.data
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0)
                .toFixed(2),
        [transactions.data]
    );

    return (
        <div className="p-4 sm:p-10 !pt-0">
            <div className="max-w-[80em] mx-auto h-full flex flex-col">
                <div className="md:flex gap-6 space-y-4 md:space-y-0 mb-14 items-center">
                    <h1 className="text-4xl font-extralight">Dashboard</h1>
                    <Select onValueChange={(val) => setSelectedAccount(Number(val))} defaultValue="0">
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Account 1</SelectItem>
                            <SelectItem value="1">Account 2</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="hidden sm:block border-r h-6 -mx-2 opacity-50"></div>
                    <Select
                        onValueChange={(val) => setSelectedMonth(Number(val))}
                        defaultValue={months.find((m) => Number(m.value) === selectedMonth)?.value}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m) => (
                                <SelectItem
                                    key={m.value}
                                    value={m.value}
                                    disabled={selectedYear === currentYear && Number(m.value) > currentMonth}
                                >
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(val) => setSelectedYear(Number(val))}
                        defaultValue={years.find((y) => Number(y) === selectedYear)}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem
                                    key={y}
                                    value={y}
                                    disabled={
                                        Number(y) > currentYear ||
                                        (Number(y) === currentYear && selectedMonth > currentMonth)
                                    }
                                >
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-10 gap-6 flex-1 h-full grid-rows-[auto_auto_1fr]">
                    {/* Tiles */}
                    <div className="col-span-4 sm:grid sm:grid-cols-subgrid space-y-2 sm:space-y-0 sm:grid-rows-subgrid row-span-2">
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Earned'}
                            amount={earned + ' PLN'}
                            change={0.0523}
                        />
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Spent'}
                            amount={spent + ' PLN'}
                            change={0.0523}
                            isInvertPositive
                        />
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Transactions'}
                            amount={transactions.data.length}
                            change={0.2023}
                        />
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Total'}
                            amount={total + ' PLN'}
                            change={0.116}
                        />
                    </div>

                    {/* Graph */}
                    <div className="col-span-full lg:col-span-6 row-span-2 hidden lg:block">
                        <Card className="h-[490px] relative">
                            {transactions.isLoading ? (
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <Chart transactions={transactions.data} />
                            )}
                        </Card>
                    </div>

                    {/* Transactions */}
                    <div className="col-span-full lg:col-span-full h-[623px]">
                        <Card className="h-full relative">
                            {transactions.isLoading && (
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <CircularProgress />
                                </div>
                            )}
                            <TransactionList transactions={transactions.data} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
