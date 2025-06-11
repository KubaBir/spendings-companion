import mongoose from 'mongoose';

// Create a document type from the interface
type MonthlyReportDocument = mongoose.Document<unknown, {}, IMonthlyReport> & IMonthlyReport;

// Define the model with proper typing
const MonthlyReportSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    account: { type: String, required: true },
    transactions: [
        {
            bookingDate: String,
            valueDate: String,
            transactionId: String,
            internalTransactionId: String,
            remittanceInformationUnstructured: String,
            transactionAmount: { amount: Number, currency: String },
            creditorName: String,
            debtorName: String,
        },
    ],
});

// Type for the mongoose model
type MonthlyReportModel = mongoose.Model<IMonthlyReport>;

// Parameters type
interface FindMonthlyReportParams {
    year: number;
    month: number;
    account: string;
}

const MonthlyReport = (mongoose.models.MonthlyReport ||
    mongoose.model('MonthlyReport', MonthlyReportSchema)) as MonthlyReportModel;

// For lean queries in Mongoose 7, lean() returns a plain JavaScript object
export async function findMonthlyReport({
    year,
    month,
    account,
}: FindMonthlyReportParams): Promise<Omit<IMonthlyReport, 'internalTransactionId'> | null> {
    const data = await MonthlyReport.findOne({ year, month, account })
        .select({ 'transactions.internalTransactionId': 0, 'transactions._id': 0, _id: 0 })
        .lean();

    return data;
}

interface UpdateMonthlyReportParams {
    year: number;
    month: number;
    account: string;
    transactions: ITransaction[];
}

export async function updateMonthlyReport({
    year,
    month,
    account,
    transactions,
}: UpdateMonthlyReportParams): Promise<MonthlyReportDocument | null> {
    const data = await MonthlyReport.findOneAndUpdate(
        { year, month, account },
        { transactions: transactions },
        { upsert: true, new: true }
    );

    return data;
}

export default MonthlyReport;
