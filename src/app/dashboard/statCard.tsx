import classNames from 'classnames';
import Card from './card';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

export default function StatCard({
    className,
    title,
    amount,
    change,
    isInvertPositive = false,
}: Readonly<{
    className?: string;
    title?: React.ReactNode;
    amount: string;
    change: number;
    isInvertPositive?: boolean;
}>) {
    return (
        <Card title={title} className="h-[200px] col-span-2">
            <div className="text-2xl font-semibold">{amount}</div>
            <div
                className={classNames(
                    ' -ml-2 mt-auto flex items-center',
                    change >= 0 && !isInvertPositive ? 'text-green-500' : 'text-red-500'
                )}
            >
                {change >= 0 ? <ArrowDropUp /> : <ArrowDropDown />}
                {Math.round(change * 10000) / 100}%
            </div>
            <div className="text-sm font-thin opacity-40">Since last month</div>
        </Card>
    );
}
