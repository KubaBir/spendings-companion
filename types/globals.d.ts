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
    }

    export interface IMonthlyReport {
        year: number;
        month: number;
        account: string;
        transactions: ITransaction[];
    }
}
