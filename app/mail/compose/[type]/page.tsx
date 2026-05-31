"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function MailComposePage() {
  const params = useParams() as any;
  const type = (params?.type as string) || "contact";
  const router = useRouter();

  const defaultTo =
    type === "report" ? "report@temppal.com" : "contact@temppal.com";

  const internalCc =
    type === "report" ? "report-internal@temppal.com" : "team@temppal.com";
  const [to, setTo] = useState<string>(defaultTo);
  const [cc, setCc] = useState<string>(internalCc);
  const [from, setFrom] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<
    {
      name: string;
      type: string;
      size: number;
      dataUrl: string;
    }[]
  >([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [readingFiles, setReadingFiles] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    ok: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    setTo(defaultTo);
    setCc(internalCc);
  }, [type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          to,
          cc,
          from,
          subject,
          message,
          attachments,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, message: data?.error || "전송 실패" });
      } else {
        setStatus({ ok: true, message: data?.message || "전송되었습니다." });
        setSubject("");
        setMessage("");
        setCc("");
        setAttachments([]);
      }
    } catch (err: any) {
      setStatus({
        ok: false,
        message: err?.message || "전송 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCancelClear() {
    setSubject("");
    setMessage("");
    setAttachments([]);
    setFileError(null);
    setStatus(null);
    // clear hidden file input if present
    try {
      const el = document.getElementById(
        "file-input",
      ) as HTMLInputElement | null;
      if (el) el.value = "";
    } catch (err) {
      // ignore
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_ATTACHMENTS = 3;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setFileError(`최대 ${MAX_ATTACHMENTS}장까지 첨부할 수 있습니다.`);
      return;
    }

    // Validate files
    for (const f of files) {
      if (!allowed.includes(f.type)) {
        setFileError(
          "지원하지 않는 파일 형식입니다. jpg, png, webp만 지원합니다.",
        );
        return;
      }
      if (f.size > MAX_SIZE) {
        setFileError("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }
    }

    setReadingFiles(true);
    try {
      const readPromises = files.map(
        (file) =>
          new Promise<{
            name: string;
            type: string;
            size: number;
            dataUrl: string;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: String(reader.result),
              });
            };
            reader.onerror = () =>
              reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
            reader.readAsDataURL(file);
          }),
      );

      const newAttachments = await Promise.all(readPromises);
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err: any) {
      setFileError(err?.message || "파일 처리 중 오류가 발생했습니다.");
    } finally {
      setReadingFiles(false);
    }
  }

  return (
    <div
      className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto p-6"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">
          {type === "report" ? "신고/접수" : "문의"}
        </h1>
        <Link href="/" className="text-sm text-zinc-500">
          홈으로
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* To and CC are hidden from users for both 문의 and 신고; kept internally in state */}
        <div>
          <label className="block text-base text-zinc-700 dark:text-zinc-300">
            제목
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded bg-white dark:bg-neutral-900 text-lg"
          />
        </div>

        <div>
          <label className="block text-base text-zinc-700 dark:text-zinc-300">
            작성자
          </label>
          <input
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="example@email.com"
            className="w-full mt-2 px-4 py-3 border rounded bg-white dark:bg-neutral-900 text-lg"
          />
        </div>

        <div>
          <label className="block text-base text-zinc-700 dark:text-zinc-300">
            내용
          </label>

          {/* inline small thumbnails inside 내용 area */}
          {attachments.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              {attachments.map((a, i) => (
                <img
                  key={i}
                  src={a.dataUrl}
                  alt={a.name}
                  className="w-12 h-12 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={12}
            className="w-full mt-2 px-4 py-4 border rounded bg-white dark:bg-neutral-900 text-lg"
          />
        </div>

        <div>
          <label className="block text-base text-zinc-700 dark:text-zinc-300">
            사진 첨부
          </label>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <label
              htmlFor="file-input"
              className="inline-flex items-center px-3 py-2 border rounded cursor-pointer bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              첨부하기
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm text-zinc-500">
              jpg, png, webp (최대 3장, 각 5MB)
            </span>
          </div>

          {fileError && (
            <div className="text-sm text-red-600 mt-2">{fileError}</div>
          )}
          {readingFiles && (
            <div className="text-sm text-zinc-500 mt-2">파일 처리 중...</div>
          )}

          {attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {attachments.map((a, i) => (
                <div
                  key={i}
                  className="relative border rounded overflow-hidden"
                >
                  <img
                    src={a.dataUrl}
                    alt={a.name}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    aria-label={`삭제 ${a.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "전송 중..." : "보내기"}
          </button>
          <button
            type="button"
            onClick={handleCancelClear}
            className="px-4 py-2 border rounded"
          >
            취소
          </button>

          {status && (
            <div
              className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}
            >
              {status.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
