import { NextRequest, NextResponse } from 'next/server';
import {
  getServerCategories,
  getServerMenuItems,
  saveServerCategory,
  deleteServerCategory,
  saveServerMenuItem,
  updateServerMenuItem,
  deleteServerMenuItem,
  seedStarterMenuForCafe,
} from '@/lib/server-menu-store';
import { MenuCategory, MenuItem } from '@/types/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cafeId = searchParams.get('cafe_id');

  if (!cafeId) {
    return NextResponse.json({
      success: true,
      categories: getServerCategories(),
      items: getServerMenuItems(),
    });
  }

  // If newly created cafe has no menu yet, seed starter menu
  let categories = getServerCategories(cafeId);
  let items = getServerMenuItems(cafeId);

  if (categories.length === 0) {
    const seeded = seedStarterMenuForCafe(cafeId);
    categories = seeded.categories;
    items = seeded.items;
  }

  return NextResponse.json({
    success: true,
    categories,
    items,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'category') {
      const saved = saveServerCategory(data as MenuCategory);
      return NextResponse.json({ success: true, category: saved }, { status: 201 });
    }

    if (type === 'item') {
      const saved = saveServerMenuItem(data as MenuItem);
      return NextResponse.json({ success: true, item: saved }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const updated = updateServerMenuItem(id, updates);
    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    if (type === 'category') {
      deleteServerCategory(id);
      return NextResponse.json({ success: true });
    }

    if (type === 'item') {
      deleteServerMenuItem(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
