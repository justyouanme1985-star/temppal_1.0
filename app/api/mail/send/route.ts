import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, to, cc, from, subject, message, attachments } = body || {};

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!from || !EMAIL_RE.test(from)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    // Validate attachments if present
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_ATTACHMENTS = 3;

    if (attachments) {
      if (!Array.isArray(attachments)) {
        return NextResponse.json({ error: "Invalid attachments" }, { status: 400 });
      }
      if (attachments.length > MAX_ATTACHMENTS) {
        return NextResponse.json({ error: `최대 ${MAX_ATTACHMENTS}개의 첨부파일만 허용됩니다.` }, { status: 400 });
      }

      for (const a of attachments) {
        if (!a || !a.name || !a.type || !a.dataUrl) {
          return NextResponse.json({ error: "잘못된 첨부파일 형식" }, { status: 400 });
        }
        if (!allowed.includes(a.type)) {
          return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 });
        }
        if (a.size > MAX_SIZE) {
          return NextResponse.json({ error: "첨부파일이 너무 큽니다 (5MB 제한)." }, { status: 400 });
        }
      }
    }

    // Simulate sending: log to server console (do not print base64 data)
    const attachmentSummary = (attachments || []).map((a: any) => ({ name: a.name, type: a.type, size: a.size }));
    console.log("[MAIL SEND]", { type, to, cc, from, subject, message, attachments: attachmentSummary });

    // Respond with success (simulation)
    return NextResponse.json({ ok: true, message: "메일이 큐에 추가되었습니다 (시뮬레이션).", attachments: attachmentSummary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
