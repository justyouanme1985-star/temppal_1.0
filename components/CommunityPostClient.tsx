"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Clock,
  FileText,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import CommentSection from "@/components/CommentSection";
import type { CommunityPostPublic } from "@/lib/communityPosts";

type Post = CommunityPostPublic;

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${h}:${min}`;
}

export default function CommunityPostClient({ post }: { post: Post }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [delPwd, setDelPwd] = useState("");
  const [delError, setDelError] = useState("");

  async function handleDelete() {
    if (!post || !delPwd) return setDelError("비밀번호를 입력해주세요.");

    const res = await fetch("/api/community", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, password: delPwd }),
    });

    if (!res.ok) {
      const data = await res.json();
      setDelError(data.error || "삭제에 실패했습니다.");
      return;
    }

    router.push("/community");
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => router.push("/community")}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>

        {/* Post */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-700">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author_nickname}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDateTime(post.created_at)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {post.content || (
                <span className="text-zinc-400 italic">내용 없음</span>
              )}
            </div>

            {/* Files */}
            {post.file_urls && post.file_urls.length > 0 && (
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-700">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  첨부파일 ({post.file_urls.length})
                </p>
                <div className="space-y-2">
                  {post.file_urls.map((url, i) => {
                    const fileName = url.split("/").pop() || `file_${i + 1}`;
                    const isImage = /\.(webp|jpg|jpeg|png|gif|bmp|svg)$/i.test(
                      fileName,
                    );
                    return isImage ? (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={fileName}
                          className="max-w-full rounded-lg border border-zinc-200 dark:border-zinc-700"
                          style={{ maxHeight: 400, width: "auto" }}
                        />
                      </a>
                    ) : (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{fileName}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="px-5 pb-4">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                삭제
              </button>
            ) : !showDelete ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                  정말 삭제하시겠습니까?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDelete(true)}
                    className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    예
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setDelPwd("");
                      setDelError("");
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    아니오
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={delPwd}
                  onChange={(e) => {
                    setDelPwd(e.target.value);
                    setDelError("");
                  }}
                  placeholder="비밀번호"
                  className="flex-1 px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                  autoFocus
                />
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setShowDelete(false);
                    setShowConfirm(false);
                    setDelPwd("");
                    setDelError("");
                  }}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  취소
                </button>
              </div>
            )}
            {delError && (
              <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {delError}
              </p>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="max-w-3xl mx-auto">
          <CommentSection
            targetType="community"
            targetId={String(post.id)}
            title="댓글"
          />
        </div>
      </div>
    </div>
  );
}
