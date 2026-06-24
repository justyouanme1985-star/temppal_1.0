"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import type { CommunityPostPublic } from "@/lib/communityPosts";
import { useAdminSession } from "@/lib/hooks/useAdminSession";

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

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { isAdmin } = useAdminSession();
  const pageSize = 20;

  useEffect(() => {
    loadPosts();
  }, [page]);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/community?page=${page}&limit=${pageSize}`,
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data: Post[] = await res.json();
      if (page === 0) setPosts(data);
      else setPosts((prev) => [...prev, ...data]);
      if (data.length < pageSize) setHasMore(false);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }

  async function handleAdminDelete(post: Post) {
    if (!confirm(`"${post.title}" 게시글과 댓글을 관리자 권한으로 삭제할까요?`)) return;

    setDeletingId(post.id);
    try {
      const res = await fetch("/api/admin/community", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "삭제에 실패했습니다.");
        return;
      }
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              커뮤니티
            </h1>
          </div>
          <Link
            href="/community/write"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            글쓰기
          </Link>
        </div>

        {/* Post List - Table view */}
        {posts.length === 0 && !loading ? (
          <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">아직 게시글이 없습니다.</p>
            <p className="text-xs mt-1">첫 번째 게시글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="hidden md:flex items-center px-4 py-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-700">
              <span className="w-12 shrink-0 text-center">번호</span>
              <span className="w-20 shrink-0">닉네임</span>
              <span className="flex-1">제목</span>
              <span className="w-28 shrink-0 text-right">날짜</span>
              {isAdmin && <span className="w-16 shrink-0 text-center">관리</span>}
            </div>
            {/* Table rows */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-sm"
                >
                  <Link
                    href={`/community/${post.id}`}
                    className="flex flex-1 items-center gap-2 min-w-0 no-underline"
                  >
                    <span className="w-12 shrink-0 text-center text-xs text-zinc-400 dark:text-zinc-500">
                      {posts.length - i}
                    </span>
                    <span className="w-20 shrink-0 truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {post.author_nickname}
                    </span>
                    <span className="flex-1 truncate font-medium text-zinc-900 dark:text-white">
                      {post.title}
                    </span>
                    <span className="w-28 shrink-0 text-right text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                      {formatDateTime(post.created_at)}
                    </span>
                  </Link>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleAdminDelete(post)}
                      disabled={deletingId === post.id}
                      className="hidden md:inline-flex w-16 shrink-0 items-center justify-center gap-1 text-[10px] text-red-500 hover:text-red-600 disabled:text-zinc-300"
                      title="관리자 삭제"
                    >
                      {deletingId === post.id ? (
                        "..."
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="px-6 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "로딩 중..." : "더보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
