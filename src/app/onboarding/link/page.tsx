'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const url = searchParams.get('url');
    if (!url) router.push('/onboarding');

    const bankData = JSON.parse(localStorage.getItem('bankData') || '{}');

    return (
        <div className="flex flex-col gap-2 items-center justify-center h-[calc(100dvh-64px)]">
            <div className="flex items-center mb-12">
                <div className="flex-shrink-0 mr-4">
                    <img
                        src={bankData.logo}
                        alt={`${bankData.name} logo`}
                        className="h-8 w-8 object-contain rounded"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">{bankData.name}</h3>
                </div>
            </div>

            <Link
                href={url!}
                className="px-6 py-3 font-bold text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-purple-600 dark:via-pink-600 dark:to-red-600 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 dark:hover:from-purple-700 dark:hover:via-pink-700 dark:hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 dark:shadow-pink-700/30"
            >
                Connect you account
            </Link>
            <span className="text-sm opacity-70">or</span>
            <Link href="/onboarding">Go back</Link>
            <div className='mb-24'></div>
        </div>
    );
}
