export {};

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            onboardingComplete?: boolean;
        };
    }

    export interface ITransaction {
        bookingDate: string;
        valueDate: string;
        transactionId: Key;
        internalTransactionId: Key;
        remittanceInformationUnstructured: string;
        transactionAmount: { amount: number; currency: string };
        creditorName?: string;
        debtorName?: string;
        accountIndex?: number;
    }

    export interface IMonthlyReport {
        year: number;
        month: number;
        account: string;
        transactions: ITransaction[];
    }

    interface IGroupedTransactions {
        [valueDate: string]: { income: number; spending: number; day: number };
    }
}
