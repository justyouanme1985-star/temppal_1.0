import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/security/clientIp';
import { detectImageType, isAllowedImageType } from '@/lib/security/imageValidation';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';
import { getSupabaseAdmin } from '@/lib/security/supabaseAdmin';

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`upload:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      rateLimitResponse('업로드 한도를 초과했습니다.', rate.resetAfterMs),
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext) || !isAllowedImageType(file.type)) {
    return NextResponse.json({ error: 'PNG, JPG, WEBP 파일만 업로드 가능합니다.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: '파일 크기는 5MB를 초과할 수 없습니다.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImageType(buffer);
  if (!detected) {
    return NextResponse.json({ error: '유효한 이미지 파일이 아닙니다.' }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: '서버 설정 오류입니다.' }, { status: 503 });
  }

  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('community_attachments')
    .upload(fileName, buffer, { contentType: detected });

  if (uploadError) {
    console.error('upload error:', uploadError);
    return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('community_attachments')
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
