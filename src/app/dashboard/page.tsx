'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTransactions } from './_actions';
import Card from './card';
import StatCard from './statCard';
import { TransactionList } from './transactionList';
import { CircularProgress } from '@mui/material';

export default function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [transactions, setTransactions] = useState<{ isLoading: boolean; data: ITransaction[] }>({
        isLoading: true,
        data: [],
    });

    useEffect(() => {
        const getTransactionData = async () => {
            try {
                setTransactions((prev) => ({ ...prev, isLoading: true }));
                const transactions = await getTransactions(4, 2025);

                setTransactions({ isLoading: false, data: transactions });
            } catch (err) {
                console.log(err);
                setTransactions({ isLoading: false, data: [] });
            }
        };

        if (selectedMonth) getTransactionData();
    }, [selectedMonth]);

    const earned = useMemo(
        () =>
            transactions.data
                .filter((t) => t.transactionAmount.amount > 0)
                .reduce((sum, transaction) => sum + transaction.transactionAmount.amount, 0),
        [transactions.data]
    );

    const spent = useMemo(
        () =>
            transactions.data
                .filter((t) => t.transactionAmount.amount < 0)
                .reduce((sum, transaction) => sum + transaction.transactionAmount.amount, 0),
        [transactions.data]
    );

    const total = useMemo(
        () => transactions.data.reduce((sum, transaction) => sum + transaction.transactionAmount.amount, 0),
        [transactions.data]
    );

    return (
        <div className="pt-8 sm:pt-16 p-4 sm:p-10">
            <div className="max-w-[80em] mx-auto h-full flex flex-col">
                <h1 className="text-4xl font-extralight mb-14">Dashboard</h1>

                <div className="grid grid-cols-4 lg:grid-cols-10 gap-6 flex-1 h-full grid-rows-[auto_auto_1fr]">
                    {/* Tiles */}
                    <div className="col-span-4 grid grid-cols-subgrid grid-rows-subgrid row-span-2">
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
                        <Card className="h-full">Incoming</Card>
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
