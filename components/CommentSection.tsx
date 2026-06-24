"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MessageSquare, Trash2 } from "lucide-react";

interface Comment {
  id: number;
  target_type: string;
  target_id: string;
  parent_id: number | null;
  author: string;
  content: string;
  created_at: string;
  deleted?: boolean;
}

interface Props {
  targetType: "player" | "equipment" | "community";
  targetId: string;
  title?: string;
}

// ── Module-level helpers ─────────────────────────────────────────────
const STORAGE_KEY = "temppal_comment_keys";

function getCommentKeys(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveCommentKey(id: number, secretKey: string) {
  const keys = getCommentKeys();
  keys[id] = secretKey;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function canDeleteComment(id: number): boolean {
  return !!getCommentKeys()[id];
}

export default function CommentSection({ targetType, targetId, title }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const isComposingRef = useRef(false);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/comments?type=${targetType}&id=${encodeURIComponent(targetId)}`,
      );
      if (res.ok) {
        setComments(await res.json());
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "댓글을 불러오지 못했습니다.");
      }
    } catch {
      setError("댓글을 불러오지 못했습니다.");
    }
    setLoading(false);
  }, [targetType, targetId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          parent_id: null,
          author: author.trim(),
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "전송 실패");
        return;
      }
      const result = await res.json();
      // Store secret key for deletion
      if (result.secret_key) {
        saveCommentKey(result.id, result.secret_key);
      }
      setAuthor("");
      setContent("");
      await loadComments();
    } catch {
      setError("전송 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: number) {
    const keys = getCommentKeys();
    const secretKey = keys[id];
    if (!secretKey) return;

    setDeleting(id);
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, secret_key: secretKey }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "삭제 실패");
      }
    } catch {}
    setDeleting(null);
    await loadComments();
  }

  // Root comments (no parent)
  const roots = comments.filter((c) => !c.parent_id);
  // Only count visible (non-deleted) comments
  const visibleCount = comments.filter((c) => !c.deleted).length;

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "방금 전";
    if (min < 60) return `${min}분 전`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}시간 전`;
    return new Date(dateStr).toLocaleDateString("ko-KR");
  }

  return (
    <div className="mt-8">
      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        {title || "댓글"}{" "}
        {!loading && (
          <span className="text-xs font-normal text-zinc-400">
            ({visibleCount})
          </span>
        )}
      </h3>

      {/* Comment list */}
      {loading ? (
        <p className="text-sm text-zinc-400">로딩 중...</p>
      ) : roots.length === 0 ? (
        <p className="text-sm text-zinc-400 mb-4">첫 댓글을 남겨보세요.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {roots.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              allComments={comments}
              timeAgo={timeAgo}
              targetType={targetType}
              targetId={targetId}
              onReplyComplete={loadComments}
              depth={0}
              canDelete={canDeleteComment(c.id)}
              deleting={deleting}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Write form — 한 줄: 이름 | 내용 | 등록 */}
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="닉네임"
          maxLength={20}
          className="w-24 shrink-0 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || e.shiftKey || isComposingRef.current) return;
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }}
          placeholder="내용"
          rows={1}
          maxLength={1500}
          className="flex-1 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required
        />
        <button
          type="submit"
          disabled={sending || !author.trim() || !content.trim()}
          className="shrink-0 px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-600 text-white rounded-lg transition-colors"
        >
          {sending ? "..." : "등록"}
        </button>
      </form>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function CommentItem({
  comment,
  allComments,
  timeAgo,
  targetType,
  targetId,
  onReplyComplete,
  depth,
  canDelete,
  deleting,
  onDelete,
}: {
  comment: Comment;
  allComments: Comment[];
  timeAgo: (s: string) => string;
  targetType: string;
  targetId: string;
  onReplyComplete: () => Promise<void>;
  depth: number;
  canDelete: boolean;
  deleting?: number | null;
  onDelete: (id: number) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState("ㅈㅈ");
  const [replyContent, setReplyContent] = useState("");
  const [replySending, setReplySending] = useState(false);

  const children = allComments.filter((c) => c.parent_id === comment.id);

  return (
    <div
      className={`${depth > 0 ? "ml-4 pl-3 border-l-2 border-zinc-200 dark:border-zinc-700" : ""}`}
    >
      {comment.deleted && children.length > 0 && (
        <p className="text-[10px] text-zinc-300 dark:text-zinc-500 italic mb-1.5">
          삭제된 댓글입니다
        </p>
      )}
      {!comment.deleted && (
        <div
          className={`bg-white dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 rounded-lg ${depth > 0 ? "p-2" : "p-3"}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-semibold text-zinc-900 dark:text-white ${depth > 0 ? "text-[11px]" : "text-sm"}`}
                >
                  {comment.author}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {timeAgo(comment.created_at)}
                </span>
              </div>
              <p
                className={`text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap wrap-break-word ${depth > 0 ? "text-[11px]" : "text-sm"}`}
              >
                {comment.content}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {canDelete && (
                <button
                  onClick={() => onDelete(comment.id)}
                  disabled={deleting === comment.id}
                  className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-[11px] text-zinc-400 hover:text-blue-500 transition-colors"
              >
                {showReply ? "취소" : "답글"}
              </button>
            </div>
          </div>

          {/* Inline reply form */}
          {showReply && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!replyAuthor.trim() || !replyContent.trim()) return;
                setReplySending(true);
                try {
                  const res = await fetch("/api/comments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      target_type: targetType,
                      target_id: targetId,
                      parent_id: comment.id,
                      author: replyAuthor.trim(),
                      content: replyContent.trim(),
                    }),
                  });
                  if (res.ok) {
                    const result = await res.json();
                    if (result.secret_key) {
                      saveCommentKey(result.id, result.secret_key);
                    }
                  }
                  setReplyAuthor("ㅈㅈ");
                  setReplyContent("");
                  setShowReply(false);
                  onReplyComplete();
                } catch {}
                setReplySending(false);
              }}
              className="flex items-start gap-1.5 mt-2"
            >
              <input
                type="text"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                placeholder="닉네임"
                maxLength={20}
                className="w-16 shrink-0 px-2 py-1 text-[11px] border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="내용"
                maxLength={1500}
                className="flex-1 px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={
                  replySending || !replyAuthor.trim() || !replyContent.trim()
                }
                className="shrink-0 px-2 py-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-600 text-white rounded transition-colors"
              >
                {replySending ? "..." : "등록"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Children */}
      {children.length > 0 && (
        <div className="space-y-1.5 mt-1.5 ml-1.5 pl-1.5 border-l-2 border-zinc-100 dark:border-zinc-700/50">
          {children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              allComments={allComments}
              timeAgo={timeAgo}
              targetType={targetType}
              targetId={targetId}
              onReplyComplete={onReplyComplete}
              depth={depth + 1}
              canDelete={canDeleteComment(child.id)}
              deleting={deleting}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
