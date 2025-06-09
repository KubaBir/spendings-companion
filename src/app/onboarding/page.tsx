import Link from 'next/link';
import { fetchBankingProviders } from './_actions';
import ProvidersBox from './components/ProvidersBox';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
    const providers = await fetchBankingProviders();
    let onboarded = false;
    if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
        onboarded = true;
    }
    console.log(onboarded);
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-64px)]">
            <ProvidersBox providers={providers} />
            {onboarded && <Link href="/">Go to dashboard</Link>}
        </div>
    );
}
