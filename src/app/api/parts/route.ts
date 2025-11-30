import { NextResponse } from 'next/server';
import { loadPartsFromCSV } from '@/lib/data';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let parts = loadPartsFromCSV();

        if (category) {
            parts = parts.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        return NextResponse.json(parts);
    } catch (error) {
        console.error('Error loading parts:', error);
        return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
    }
}
