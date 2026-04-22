'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { getAccounts, getTransactions } from './_actions';
import Card from './card';
import { Chart } from './chart';
import StatCard from './statCard';
import { TransactionList } from './transactionList';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

function calculateChange(oldValue: number, newValue: number) {
    if (oldValue === 0 || newValue === 0) {
        return 0;
    }

    const percentageChange = (newValue - oldValue) / oldValue;

    return Math.round(percentageChange * 100) / 100;
}

export function getPreviousMonth(year: number, month: number) {
    const date = new Date(year, month, 1);

    date.setMonth(date.getMonth() - 1);

    return {
        year: date.getFullYear(),
        month: date.getMonth(),
    };
}

export default function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedAccount, setSelectedAccount] = useState<string>('all');
    const [transactions, setTransactions] = useState<{ isLoading: boolean; data: ITransaction[] }>({
        isLoading: true,
        data: [],
    });
    const [prevMonthTransactions, setPrevMonthTransactions] = useState<{
        isLoading: boolean;
        data: ITransaction[];
    }>({
        isLoading: true,
        data: [],
    });

    const [accounts, setAccounts] = useState<{ id: number; logo: string }[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const accounts = await getAccounts();
            setAccounts(accounts);
        };
        fetch();
    }, []);

    const getTransactionData = async (isForced: boolean = false) => {
        try {
            setTransactions({ isLoading: true, data: [] });
            const prevDate = getPreviousMonth(selectedYear, selectedMonth);

            const prevMonthPromise = getTransactions(
                prevDate.month + 1,
                prevDate.year,
                selectedAccount === 'all' ? undefined : Number(selectedAccount),
                false
            );
            const transactions = await getTransactions(
                selectedMonth + 1,
                selectedYear,
                selectedAccount === 'all' ? undefined : Number(selectedAccount),
                isForced
            );
            setTransactions({ isLoading: false, data: transactions });

            const prevTransactions = await prevMonthPromise;
            setPrevMonthTransactions({ isLoading: false, data: prevTransactions });
        } catch (err) {
            console.log(err);
            setTransactions({ isLoading: false, data: [] });
        }
    };

    useEffect(() => {
        getTransactionData();
    }, [selectedMonth, selectedYear, selectedAccount]);

    const stats = useMemo(
        () => ({
            earned: transactions.data
                .filter((t) => t.transactionAmount.amount > 0)
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0),
            spent: transactions.data
                .filter((t) => t.transactionAmount.amount < 0)
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0),
            total: transactions.data.reduce(
                (sum, transaction) => sum + Number(transaction.transactionAmount.amount),
                0
            ),
        }),
        [transactions.data]
    );

    const prevMonthStats = useMemo(
        () => ({
            earned: prevMonthTransactions.data
                .filter((t) => t.transactionAmount.amount > 0)
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0),
            spent: prevMonthTransactions.data
                .filter((t) => t.transactionAmount.amount < 0)
                .reduce((sum, transaction) => sum + Number(transaction.transactionAmount.amount), 0),
            total: prevMonthTransactions.data.reduce(
                (sum, transaction) => sum + Number(transaction.transactionAmount.amount),
                0
            ),
        }),
        [prevMonthTransactions.data]
    );

    return (
        <div className="p-4 sm:p-10 !pt-0">
            <div className="max-w-[80em] mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="md:flex gap-6 space-y-4 md:space-y-0 mb-14 items-center">
                    <h1 className="text-4xl font-extralight">Dashboard</h1>
                    <Select onValueChange={(val) => setSelectedAccount(val)} defaultValue={selectedAccount}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Accounts</SelectItem>
                            {accounts.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    <div className="flex items-center justify-between w-[150px]">
                                        Account {a.id + 1}
                                        <img src={a.logo} about="bank logo" className="size-4" />
                                    </div>
                                </SelectItem>
                            ))}
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

                    {selectedAccount !== 'all' && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        'bg-primary p-1 w-[26px] flex rounded-md hover:saturate-[150%] shadow-md cursor-pointer',
                                        transactions.isLoading ||
                                            (prevMonthTransactions.isLoading && 'pointer-events-none')
                                    )}
                                    onClick={() => getTransactionData(true)}
                                >
                                    <RefreshCw size={18} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Fetch transactions</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-10 gap-6 flex-1 h-full grid-rows-[auto_auto_1fr]">
                    {/* Tiles */}
                    <div className="col-span-4 sm:grid sm:grid-cols-subgrid space-y-2 sm:space-y-0 sm:grid-rows-subgrid row-span-2">
                        <StatCard
                            title={'Earned'}
                            amount={stats.earned.toFixed(2) + ' PLN'}
                            change={calculateChange(prevMonthStats.earned, stats.earned)}
                            isLoading={transactions.isLoading || prevMonthTransactions.isLoading}
                        />
                        <StatCard
                            title={'Spent'}
                            amount={stats.spent.toFixed(2) + ' PLN'}
                            change={calculateChange(prevMonthStats.spent, stats.spent)}
                            isLoading={transactions.isLoading || prevMonthTransactions.isLoading}
                            isInvertPositive
                        />
                        <StatCard
                            title={'Transactions'}
                            amount={transactions.data.length}
                            change={calculateChange(
                                prevMonthTransactions.data.length,
                                transactions.data.length
                            )}
                            isLoading={transactions.isLoading || prevMonthTransactions.isLoading}
                            isInvertPositive
                        />
                        <StatCard
                            title={'Total'}
                            amount={stats.total.toFixed(2) + ' PLN'}
                            change={calculateChange(prevMonthStats.total, stats.total)}
                            isLoading={transactions.isLoading || prevMonthTransactions.isLoading}
                        />
                    </div>

                    {/* Chart */}
                    <div className="col-span-full lg:col-span-6 row-span-2 hidden lg:block">
                        <Card className="h-[490px] relative">
                            {transactions.isLoading ? (
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <CircularProgress color="inherit" />
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
                                    <CircularProgress color="inherit" />
                                </div>
                            )}
                            <TransactionList
                                transactions={transactions.data}
                                accounts={accounts}
                                selectedAccount={selectedAccount}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
