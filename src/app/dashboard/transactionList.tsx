import { ArrowDropDown, ArrowDropUp, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import classNames from 'classnames';
import { useMemo, useState } from 'react';

type SortKey = 'amount' | 'description' | 'valueDate' | 'bookingDate';
type SortDirection = 'asc' | 'desc';

export function TransactionList({ transactions }: { transactions: ITransaction[] }) {
    const [sortKey, setSortKey] = useState<SortKey>('bookingDate');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => {
            let valueA: string | number;
            let valueB: string | number;

            switch (sortKey) {
                case 'amount':
                    valueA = a.transactionAmount.amount;
                    valueB = b.transactionAmount.amount;
                    break;
                case 'description':
                    valueA = a.remittanceInformationUnstructured || '';
                    valueB = b.remittanceInformationUnstructured || '';
                    break;
                case 'valueDate':
                    valueA = a.valueDate || '';
                    valueB = b.valueDate || '';
                    break;
                case 'bookingDate':
                    valueA = a.bookingDate || '';
                    valueB = b.bookingDate || '';
                    break;
                default:
                    valueA = '';
                    valueB = '';
            }

            if (sortDirection === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }, [transactions, sortKey, sortDirection]);

    const renderSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortDirection === 'asc' ? (
            <KeyboardArrowUp fontSize="small" className="ml-1" />
        ) : (
            <KeyboardArrowDown fontSize="small" className="ml-1" />
        );
    };

    return (
        <div className="h-full grid grid-cols-[120px_auto] grid-rows-[49px_auto] md:grid-cols-[150px_auto_150px_150px] gap-x-1 md:gap-x-4">
            <div
                className={classNames(
                    'sticky bg-primary h-[49px] top-0 z-10 select-none col-span-full grid grid-cols-subgrid p-3 font-bold border-b border-white/50',
                    !transactions.length && 'invisible'
                )}
            >
                <div className="pl-6 flex items-center cursor-pointer" onClick={() => handleSort('amount')}>
                    <span>Amount</span>
                    {renderSortIndicator('amount')}
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('description')}>
                    <span>Description</span>
                    {renderSortIndicator('description')}
                </div>
                <div
                    className="hidden md:flex items-center cursor-pointer text-nowrap"
                    onClick={() => handleSort('valueDate')}
                >
                    <span>Value Date</span>
                    {renderSortIndicator('valueDate')}
                </div>
                <div
                    className="hidden md:flex items-center cursor-pointer"
                    onClick={() => handleSort('bookingDate')}
                >
                    <span>Booking Date</span>
                    {renderSortIndicator('bookingDate')}
                </div>
            </div>
            <div
                className={classNames(
                    'overflow-y-auto flex-grow grid col-span-full grid-cols-subgrid overflow-clip transition-all duration-500',
                    transactions.length ? 'h-[526px]' : 'h-0'
                )}
            >
                {sortedTransactions.map((transaction) => (
                    <div
                        key={transaction.transactionId}
                        className="grid grid-cols-subgrid p-3 border-b border-white/20 col-span-full"
                    >
                        <div className="font-medium flex items-center">
                            {transaction.transactionAmount.amount > 0 ? (
                                <ArrowDropUp className="text-green-500" />
                            ) : (
                                <ArrowDropDown className="text-red-500" />
                            )}
                            {Math.abs(transaction.transactionAmount.amount)}{' '}
                            {transaction.transactionAmount.currency}
                        </div>
                        <div className="truncate">{transaction.remittanceInformationUnstructured}</div>
                        <div className="hidden md:block">{transaction.valueDate}</div>
                        <div className="hidden md:block">{transaction.bookingDate}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
