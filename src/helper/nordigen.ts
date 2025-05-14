'use server';

import { cookies } from 'next/headers';

export async function getNordigenToken() {
    try {
        const cookieStore = await cookies();
        const nordigenToken = cookieStore.get('nordigenToken');
        if (nordigenToken) {
            console.log('Token retrieved from cookies');
            return nordigenToken.value;
        }

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

        cookieStore.set('nordigenToken', tokenData.access, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: tokenData.access_expires,
        });

        return tokenData.access;
    } catch (err) {
        console.log(err);
    }
}
