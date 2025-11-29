import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const where = category ? { category: { name: category } } : {};

        const parts = await db.part.findMany({
            where,
            include: {
                prices: {
                    orderBy: { scrapedAt: 'desc' },
                    take: 1
                }
            }
        });

        return NextResponse.json(parts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
    }
}
