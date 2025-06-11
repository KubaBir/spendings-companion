'use client';

import { redirect } from 'next/navigation';
import { buildRequisitionLink } from '../_actions';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import classNames from 'classnames';

export default function ProviderCard({ provider }) {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div
            className={classNames(
                'flex relative items-center p-4 bg-gray-800 rounded-lg shadow-md mb-3 hover:bg-gray-700 transition-colors h-[80px]',
                isLoading ? 'pointer-events-none' : 'cursor-pointer'
            )}
            onClick={async () => {
                setIsLoading(true);
                const url = await buildRequisitionLink(provider.id, provider.logo);

                localStorage.setItem(
                    'bankData',
                    JSON.stringify({ name: provider.name, logo: provider.logo })
                );

                if (url) redirect(`/onboarding/link?url=${url}`);
            }}
        >
            <div className="flex-shrink-0 mr-4">
                <img
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    className="h-12 w-12 object-contain rounded"
                />
            </div>
            <div>
                <h3 className="text-lg font-medium text-white">{provider.name}</h3>
            </div>

            {isLoading && (
                <div className="absolute inset-0 items-center justify-center flex bg-black/70 rounded-lg">
                    <CircularProgress />
                </div>
            )}
        </div>
    );
}
