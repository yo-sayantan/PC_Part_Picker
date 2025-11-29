import { NextResponse } from 'next/server';
import { sendBuildSummary } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, buildData } = body;

        if (!email || !buildData) {
            return NextResponse.json({ error: 'Missing email or build data' }, { status: 400 });
        }

        await sendBuildSummary(email, buildData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
