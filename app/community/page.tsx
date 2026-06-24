"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
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

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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
            </div>
            {/* Table rows */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors no-underline text-sm"
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
