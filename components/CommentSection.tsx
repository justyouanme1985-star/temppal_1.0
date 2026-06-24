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

export default function CommentSection({ targetType, targetId, title }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
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
    if (!author.trim() || !password.trim() || !content.trim()) return;
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
          password: password.trim(),
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "전송 실패");
        return;
      }
      const result = await res.json();
      saveCommentKey(result.id, password.trim());
      setAuthor("");
      setPassword("");
      setContent("");
      await loadComments();
    } catch {
      setError("전송 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: number, deletePassword: string) {
    if (!deletePassword.trim()) return;

    setDeleting(id);
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, secret_key: deletePassword.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "삭제 실패");
        return;
      }
      const keys = getCommentKeys();
      delete keys[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
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
              deleting={deleting}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CommentWriteForm
        author={author}
        password={password}
        content={content}
        onAuthorChange={setAuthor}
        onPasswordChange={setPassword}
        onContentChange={setContent}
        onSubmit={handleSubmit}
        sending={sending}
        isComposingRef={isComposingRef}
      />
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
  deleting?: number | null;
  onDelete: (id: number, password: string) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyPassword, setReplyPassword] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replySending, setReplySending] = useState(false);
  const replyComposeRef = useRef(false);

  const children = allComments.filter((c) => c.parent_id === comment.id);

  function openDeleteForm() {
    const saved = getCommentKeys()[comment.id];
    setDeletePassword(saved || "");
    setShowDelete(true);
    setShowReply(false);
  }

  function closeDeleteForm() {
    setShowDelete(false);
    setDeletePassword("");
  }

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
              {showDelete ? (
                <div className="flex items-center gap-1">
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="비밀번호"
                    maxLength={50}
                    className={`${depth > 0 ? "w-16 text-[10px] px-1.5 py-1" : "w-20 text-[11px] px-2 py-1"} border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-500`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && deletePassword.trim()) {
                        onDelete(comment.id, deletePassword);
                        closeDeleteForm();
                      }
                      if (e.key === "Escape") closeDeleteForm();
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(comment.id, deletePassword);
                      closeDeleteForm();
                    }}
                    disabled={deleting === comment.id || !deletePassword.trim()}
                    className={`${depth > 0 ? "text-[10px] px-1.5 py-1" : "text-[11px] px-2 py-1"} font-medium text-red-500 hover:text-red-600 disabled:text-zinc-300 transition-colors`}
                  >
                    {deleting === comment.id ? "..." : "삭제"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDeleteForm}
                    className={`${depth > 0 ? "text-[10px]" : "text-[11px]"} text-zinc-400 hover:text-zinc-600 transition-colors`}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openDeleteForm}
                  className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowReply(!showReply);
                  setShowDelete(false);
                }}
                className="text-[11px] text-zinc-400 hover:text-blue-500 transition-colors"
              >
                {showReply ? "취소" : "답글"}
              </button>
            </div>
          </div>

          {showReply && (
            <div className="mt-2">
              <CommentWriteForm
                compact
                author={replyAuthor}
                password={replyPassword}
                content={replyContent}
                onAuthorChange={setReplyAuthor}
                onPasswordChange={setReplyPassword}
                onContentChange={setReplyContent}
                sending={replySending}
                isComposingRef={replyComposeRef}
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!replyAuthor.trim() || !replyPassword.trim() || !replyContent.trim()) return;
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
                        password: replyPassword.trim(),
                        content: replyContent.trim(),
                      }),
                    });
                    if (res.ok) {
                      const result = await res.json();
                      saveCommentKey(result.id, replyPassword.trim());
                    }
                    setReplyAuthor("");
                    setReplyPassword("");
                    setReplyContent("");
                    setShowReply(false);
                    onReplyComplete();
                  } catch {}
                  setReplySending(false);
                }}
              />
            </div>
          )}
        </div>
      )}

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
              deleting={deleting}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentWriteForm({
  author,
  password,
  content,
  onAuthorChange,
  onPasswordChange,
  onContentChange,
  onSubmit,
  sending,
  isComposingRef,
  compact = false,
}: {
  author: string;
  password: string;
  content: string;
  onAuthorChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  isComposingRef: React.RefObject<boolean>;
  compact?: boolean;
}) {
  const formHeight = compact ? "h-[52px]" : "h-[72px]";
  const sideWidth = compact ? "w-20" : "w-28";
  const fieldClass = compact
    ? "w-full min-h-0 flex-1 px-2 text-[10px] leading-none border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
    : "w-full min-h-0 flex-1 px-2 text-[11px] leading-none border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const textareaClass = compact
    ? "flex-1 h-full min-h-0 min-w-0 px-2 py-1.5 text-xs leading-snug border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
    : "flex-1 h-full min-h-0 min-w-0 px-3 py-2 text-sm leading-snug border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none";
  const buttonClass = compact
    ? "shrink-0 h-full px-2.5 text-[11px] font-medium bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-600 text-white rounded transition-colors"
    : "shrink-0 h-full px-4 text-sm font-medium bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-600 text-white rounded-lg transition-colors";

  const canSubmit =
    author.trim().length > 0 &&
    password.trim().length > 0 &&
    content.trim().length > 0;

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-stretch gap-2 ${formHeight}`}
    >
      <div className={`flex flex-col gap-1 shrink-0 h-full ${sideWidth}`}>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="닉네임"
          maxLength={20}
          className={fieldClass}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="비밀번호"
          maxLength={50}
          className={fieldClass}
          required
        />
      </div>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
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
        maxLength={1500}
        className={textareaClass}
        required
      />
      <button
        type="submit"
        disabled={sending || !canSubmit}
        className={buttonClass}
      >
        {sending ? "..." : "등록"}
      </button>
    </form>
  );
}
