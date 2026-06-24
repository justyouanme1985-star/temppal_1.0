import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getClientIp } from "@/lib/security/clientIp";
import {
  decodeBase64DataUrl,
  isAllowedImageType,
  validateImageBuffer,
} from "@/lib/security/imageValidation";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAIL_DESTINATION = process.env.MAIL_TO || "temppal2026@gmail.com";

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`mail:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!rateCheck.ok) {
      return NextResponse.json(
        rateLimitResponse("1시간 내 메일 발송 한도(20개)를 초과했습니다.", rateCheck.resetAfterMs),
        { status: 429 },
      );
    }

    const body = await req.json();
    const { type, cc, from, subject, message, attachments } = body || {};

    if (!subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!from || !EMAIL_RE.test(from)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    const to = MAIL_DESTINATION;
    const safeCc = typeof cc === "string" && EMAIL_RE.test(cc) ? cc : "";

    const MAX_SIZE = 5 * 1024 * 1024;
    const MAX_ATTACHMENTS = 3;
    const validatedAttachments: {
      name: string;
      type: string;
      size: number;
      content: string;
      contentType: string;
    }[] = [];

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
        if (!isAllowedImageType(a.type)) {
          return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 });
        }
        if (a.size > MAX_SIZE) {
          return NextResponse.json({ error: "첨부파일이 너무 큽니다 (5MB 제한)." }, { status: 400 });
        }

        const raw = decodeBase64DataUrl(a.dataUrl);
        if (!raw || raw.length > MAX_SIZE) {
          return NextResponse.json({ error: "잘못된 첨부파일 데이터입니다." }, { status: 400 });
        }

        const detected = validateImageBuffer(raw, a.type);
        if (!detected) {
          return NextResponse.json({ error: "첨부파일 내용이 유효한 이미지가 아닙니다." }, { status: 400 });
        }

        validatedAttachments.push({
          name: a.name,
          type: detected,
          size: a.size,
          content: raw.toString("base64"),
          contentType: detected,
        });
      }
    }

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

    if (validatedAttachments.length > 0) {
      mailOptions.attachments = validatedAttachments.map((a) => ({
        filename: a.name,
        content: a.content,
        encoding: "base64",
        contentType: a.contentType,
      }));
    }

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    const attachmentSummary = validatedAttachments.map((a) => ({
      name: a.name,
      type: a.type,
      size: a.size,
    }));

    return NextResponse.json({
      ok: true,
      message: "메일이 전송되었습니다.",
      attachments: attachmentSummary,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "메일 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
