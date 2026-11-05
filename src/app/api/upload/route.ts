import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'panggil-assets';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // If Supabase Storage is configured in Production
    if (isSupabaseConfigured && supabase) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type || 'image/png',
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return NextResponse.json({ success: true, url: urlData.publicUrl });
      }
    }

    // Fallback: Convert to Base64 data URL if storage bucket is not yet active
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'image/png';
    const base64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({ success: true, url: base64Url });
  } catch (err) {
    const msg = (err as Error)?.message || 'Upload failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
