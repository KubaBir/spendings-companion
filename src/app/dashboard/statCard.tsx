import classNames from 'classnames';
import Card from './card';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

export default function StatCard({
    title,
    amount,
    change,
    isInvertPositive = false,
    isLoading,
}: Readonly<{
    title?: React.ReactNode;
    amount: string | number;
    change: number;
    isInvertPositive?: boolean;
    isLoading: boolean;
}>) {
    return (
        <Card title={title} className="col-span-2">
            <div className="text-2xl font-semibold ">
                {isLoading ? <CircularProgress size={30} color="inherit" /> : amount}
            </div>
            <div
                className={classNames('-ml-2 mt-auto flex items-center', {
                    'text-white': change === 0,
                    ...(isInvertPositive
                        ? {
                              'text-green-500': change < 0,
                              'text-red-500': change > 0,
                          }
                        : {
                              'text-green-500': change > 0,
                              'text-red-500': change < 0,
                          }),
                })}
            >
                {change >= 0 ? <ArrowDropUp /> : <ArrowDropDown />}
                {change === 0 ? '?' : Math.round(change * 10000) / 100}%
            </div>
            <div className="text-sm font-thin opacity-40">Since last month</div>
        </Card>
    );
}
