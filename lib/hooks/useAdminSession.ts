"use client";

import { useCallback, useEffect, useState } from "react";

export const ADMIN_SESSION_EVENT = "temppal-admin-change";

export function notifyAdminSessionChange() {
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (!res.ok) {
        setIsAdmin(false);
        return;
      }
      const data = await res.json();
      setIsAdmin(Boolean(data.ok));
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onChange = () => {
      refresh();
    };
    window.addEventListener(ADMIN_SESSION_EVENT, onChange);
    return () => window.removeEventListener(ADMIN_SESSION_EVENT, onChange);
  }, [refresh]);

  return { isAdmin, loading, refresh };
}
