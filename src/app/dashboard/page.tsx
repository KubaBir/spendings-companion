import Card from './card';
import { ArrowDropUp } from '@mui/icons-material';
import StatCard from './statCard';

export default function Dashboard() {
    return (
        <div className="pt-16 p-10 h-[100dvh]">
            <div className="max-w-[80em] mx-auto h-full flex flex-col">
                <h1 className="text-4xl font-extralight mb-14">Dashboard</h1>

                <div className="grid grid-cols-4 lg:grid-cols-10 gap-6 flex-1 h-full grid-rows-[auto_auto_1fr]">
                    {/* Tiles */}
                    <div className="col-span-4 grid grid-cols-subgrid grid-rows-subgrid row-span-2">
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Earned'}
                            amount="6400zł"
                            change={0.0523}
                        />
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Spent'}
                            amount="1427zł"
                            change={0.0523}
                            isInvertPositive
                        />
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Transactions'}
                            amount="49"
                            change={0.2023}
                        />
                        <StatCard
                            className="aspect-square col-span-2"
                            title={'Total'}
                            amount="+4973"
                            change={0.116}
                        />
                    </div>

                    {/* Graph */}
                    <div className="col-span-full lg:col-span-6 row-span-2 hidden lg:block">
                        <Card className="h-full">Incoming</Card>
                    </div>

                    {/* Transactions */}
                    <div className="col-span-full lg:col-span-7">
                        <Card className="h-full">Transactions</Card>
                    </div>

                    {/* ??? - part of the last row */}
                    <div className="col-span-full lg:col-span-3">
                        <Card className="h-full">???</Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
