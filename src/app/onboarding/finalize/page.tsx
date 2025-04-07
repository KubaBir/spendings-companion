import { redirect } from 'next/navigation';
import { finalizeSetup } from '../_actions';
import { LinearProgress } from '@mui/material';

export default async function Home() {
    finalizeSetup().then(redirect('/'));

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-64px)]">
            <div>Finalizing your account...</div>
            <div className="w-64">
                <LinearProgress />
            </div>
        </div>
    );
}
