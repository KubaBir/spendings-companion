'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { randomUUID } from 'crypto';

async function fetchNordigenToken() {
    // return process.env.NORDIGEN_ACCESS_TOKEN;
    try {
        const tokenResponse = await fetch('https://bankaccountdata.gocardless.com/api/v2/token/new/', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret_id: process.env.NORDIGEN_SECRET_ID,
                secret_key: process.env.NORDIGEN_SECRET_KEY,
            }),
        });

        if (!tokenResponse.ok) {
            console.log(tokenResponse);
            throw new Error('Failed to get access token');
        }

        const tokenData = await tokenResponse.json();
        return tokenData.access;
    } catch (err) {
        console.log(err);
    }
}

export async function fetchBankingProviders() {
    try {
        const accessToken = await fetchNordigenToken();

        const response = await fetch(
            'https://bankaccountdata.gocardless.com/api/v2/institutions/?country=pl',
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
            throw new Error('Failed to fetch banking providers');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching banking providers:', error);
        return [];
    }
}

export async function buildRequisitionLink(institutionId: string, bankIcon: string) {
    const { userId } = await auth();

    if (!userId) {
        return { message: 'No Logged In User' };
    }

    const accessToken = await fetchNordigenToken();

    try {
        const requisitionResponse = await fetch(
            'https://bankaccountdata.gocardless.com/api/v2/requisitions/',
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    institution_id: institutionId,
                    redirect: `http://localhost:3000/onboarding/finalize`,
                    user_language: 'PL',
                }),
            }
        );

        if (!requisitionResponse.ok) {
            console.log(requisitionResponse);
            throw new Error('Failed to create the requisition link');
        }

        const requisitionData = await requisitionResponse.json();

        const client = await clerkClient();

        try {
            await client.users.updateUserMetadata(userId, {
                privateMetadata: {
                    requisitionId: requisitionData.id,
                    bankIcon: bankIcon,
                },
            });
        } catch (err) {
            return { error: 'There was an error updating the user metadata.' };
        }

        return requisitionData.link;
    } catch (err) {
        console.log(err);
    }
}

export async function finalizeSetup() {
    const { userId } = await auth();

    if (!userId) {
        return { message: 'No Logged In User' };
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const accessToken = await fetchNordigenToken();

    try {
        const requisitionResponse = await fetch(
            `https://bankaccountdata.gocardless.com/api/v2/requisitions/${user.privateMetadata.requisitionId}`,
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!requisitionResponse.ok) {
            console.log(requisitionResponse);
            throw new Error('Failed to get users accounts');
        }

        const requisitionData = await requisitionResponse.json();

        if (!requisitionData.accounts?.length) {
            console.log(requisitionResponse);
            throw new Error('Failed to get users accounts');
        }

        try {
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    onboardingComplete: true,
                },
                privateMetadata: {
                    requisitionId: null,
                    accounts: [
                        ...((user.privateMetadata.accounts as { account: string; logo: string }[]) ?? []),
                        { account: requisitionData.accounts[0], logo: user.privateMetadata.bankIcon },
                    ],
                },
            });
        } catch (err) {
            return { error: 'There was an error updating the user metadata.' };
        }

        return requisitionData.link;
    } catch (err) {
        console.log(err);
    }
}
