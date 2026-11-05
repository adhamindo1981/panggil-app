import { NextRequest, NextResponse } from 'next/server';
import {
  getServerCafes,
  getServerCafeBySlug,
  saveServerCafe,
  deleteServerCafe,
  getOrCreateDynamicCafe,
} from '@/lib/server-cafe-store';
import { Cafe } from '@/types/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const cafe = getServerCafeBySlug(slug) || getOrCreateDynamicCafe(slug);
    return NextResponse.json({ success: true, cafe });
  }

  const cafes = getServerCafes();
  return NextResponse.json({ success: true, cafes });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Cafe;
    if (!body || !body.slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const saved = saveServerCafe(body);
    return NextResponse.json({ success: true, cafe: saved }, { status: 201 });
  } catch (err) {
    const errorMsg = (err as Error)?.message || String(err);
    console.error('Cafe save error:', err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Id is required' }, { status: 400 });
    }

    deleteServerCafe(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
