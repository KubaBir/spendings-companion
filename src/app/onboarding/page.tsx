import Link from 'next/link';
import { Suspense } from 'react';
import { fetchBankingProviders } from './_actions';
import ProvidersBox from './components/ProvidersBox';
import { auth } from '@clerk/nextjs/server';
import { CircularProgress } from '@mui/material';

function OnboardingFallback() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-64px)]">
            <CircularProgress color="inherit" />
            <p className="text-sm text-foreground/60">Loading banking providers…</p>
        </div>
    );
}

async function OnboardingContent() {
    const providers = await fetchBankingProviders();
    let onboarded = false;
    if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
        onboarded = true;
    }
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-64px)]">
            <ProvidersBox providers={providers} />
            {onboarded && <Link href="/">Go to dashboard</Link>}
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<OnboardingFallback />}>
            <OnboardingContent />
        </Suspense>
    );
}
