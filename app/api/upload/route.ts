import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ── Best-effort per-IP rate limit (in-memory; resets on cold start) ──
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const uploadRateMap = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (uploadRateMap.get(ip) || []).filter((t) => t > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    uploadRateMap.set(ip, recent);
    return false;
  }
  recent.push(now);
  uploadRateMap.set(ip, recent);
  return true;
}

/** Verify the actual file bytes match an allowed image format (magic numbers). */
function detectImageType(bytes: Uint8Array): string | null {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '업로드 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // Validate file type
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'PNG, JPG, WEBP 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '파일 크기는 5MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    // Validate actual file contents (defends against spoofed extension/mime)
    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = detectImageType(buffer);
    if (!detected || !ALLOWED_TYPES.includes(detected)) {
      return NextResponse.json({ error: '유효한 이미지 파일이 아닙니다.' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('community_attachments')
      .upload(fileName, buffer, {
        contentType: detected,
      });

    if (uploadError) {
      return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('community_attachments')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });

  } catch {
    return NextResponse.json({ error: '업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
