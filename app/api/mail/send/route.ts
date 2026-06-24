import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fixed destination — the client-supplied `to` is ignored to prevent this
// endpoint from being abused as an open mail relay.
const MAIL_DESTINATION = process.env.MAIL_TO || "temppal2026@gmail.com";

/** Escape user-controlled text before embedding it into the HTML email body. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Rate limiter: max 20 emails per hour per IP ──
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateMap = new Map<string, number[]>();

function checkRateLimit(ip: string): { ok: boolean; remaining: number; resetAfter: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let timestamps = rateMap.get(ip);
  if (!timestamps) {
    timestamps = [];
    rateMap.set(ip, timestamps);
  }

  // Remove old entries outside the window
  const recent = timestamps.filter(t => t > windowStart);
  rateMap.set(ip, recent);

  const remaining = RATE_LIMIT_MAX - recent.length;
  const oldest = recent.length > 0 ? recent[0] : now;
  const resetAfter = Math.max(0, RATE_LIMIT_WINDOW_MS - (now - oldest));

  if (recent.length >= RATE_LIMIT_MAX) {
    return { ok: false, remaining: 0, resetAfter };
  }

  recent.push(now);
  return { ok: true, remaining: remaining - 1, resetAfter };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: Request) {
  try {
    // ── Rate limit check ──
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.ok) {
      const minutes = Math.ceil(rateCheck.resetAfter / 60000);
      return NextResponse.json({
        error: `1시간 내 메일 발송 한도(20개)를 초과했습니다. ${minutes}분 후에 다시 시도해주세요.`,
        retryAfter: rateCheck.resetAfter,
      }, { status: 429 });
    }

    const body = await req.json();
    const { type, cc, from, subject, message, attachments } = body || {};

    if (!subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!from || !EMAIL_RE.test(from)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    // Ignore any client-supplied recipient; always deliver to the fixed inbox.
    const to = MAIL_DESTINATION;
    // Only honour cc when it is a valid email address.
    const safeCc = typeof cc === "string" && EMAIL_RE.test(cc) ? cc : "";

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

    // Build email
    const typeLabel = type === "report" ? "[신고/접수]" : "[문의]";
    const safeFrom = escapeHtml(from);
    const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br>");
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${from}" <${process.env.SMTP_USER || "noreply@temppal.com"}>`,
      to,
      replyTo: from,
      cc: safeCc || undefined,
      subject: `${typeLabel} ${subject}`,
      text: `보낸 사람: ${from}\n${safeCc ? `참조: ${safeCc}\n` : ""}\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p><strong>보낸 사람:</strong> ${safeFrom}</p>
          ${safeCc ? `<p><strong>참조:</strong> ${escapeHtml(safeCc)}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #e0e0e0;" />
          <div style="white-space: pre-wrap;">${safeMessageHtml}</div>
        </div>
      `,
    };

    // Attach files
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((a: any) => ({
        filename: a.name,
        content: a.dataUrl.split(",")[1],
        encoding: "base64",
        contentType: a.type,
      }));
    }

    // Send via SMTP
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    const attachmentSummary = (attachments || []).map((a: any) => ({ name: a.name, type: a.type, size: a.size }));
    console.log("[MAIL SEND OK]", { type, to, from, subject, attachments: attachmentSummary });

    return NextResponse.json({ ok: true, message: "메일이 전송되었습니다.", attachments: attachmentSummary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "메일 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요." }, { status: 500 });
  }
}
