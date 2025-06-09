'use server';

import { getNordigenToken } from '@/helper/nordigen';
import dbConnect from '@/lib/mongo';
import { findMonthlyReport, updateMonthlyReport } from '@/models/monthlyReport';
import { auth, clerkClient } from '@clerk/nextjs/server';

function getMonthStartAndEndDates(month: number, year: number) {
    const today = new Date();
    if (month < 1 || month > 12) {
        throw new Error('Month must be between 1 and 12');
    }

    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        throw new Error('Year and month must be integers');
    }

    const startDate = new Date(year, month - 1, 1);

    let endDate = new Date(year, month, 0);
    if (endDate > today) endDate = today;

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    };

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    };
}

export async function getTransactions(
    month: number,
    year: number,
    accountIndex: number = 0
): Promise<ITransaction[]> {
    let transactions;

    const { userId } = await auth();
    if (!userId) {
        throw new Error('User not logged in');
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const accounts = (user.privateMetadata.accounts as unknown[]) || [];
    if (!accounts?.length) {
        throw new Error('Users account not found');
    }

    await dbConnect();

    // TODO let the user choose account to update
    const account = accounts[accountIndex] as string;
    const monthlyReport = await findMonthlyReport({ year, month, account });
    if (monthlyReport) {
        transactions = monthlyReport.transactions;
    } else {
        transactions = await fetchTransactions({ account, month, year });
        await updateMonthlyReport({ year, month, account, transactions });
    }

    transactions = transactions.map((transaction) => ({
        ...transaction,
        transactionAmount: {
            // amount: Math.floor(Math.random() * (40 + 150 + 1)) - 150,
            amount: Number(transaction.transactionAmount.amount),
            currency: transaction.transactionAmount.currency,
        },
    }));

    return transactions;
}

async function fetchTransactions({
    account,
    month,
    year,
}: {
    account: string;
    month: number;
    year: number;
}): Promise<ITransaction[]> {
    console.log('Fetching transaction list');
    const dates = getMonthStartAndEndDates(month, year);
    const token = await getNordigenToken();

    const transactionsResponse = await fetch(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${account}/transactions?date_from=${dates.startDate}&date_to=${dates.endDate}`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!transactionsResponse.ok) {
        const res = await transactionsResponse.json();
        console.log(res);
        throw new Error('Failed to get users accounts');
    }

    const transactionData = await transactionsResponse.json();

    console.log(transactionData.transactions.booked[0]);

    return transactionData.transactions.booked;
}
