"use client";

import { useEffect, useState } from "react";
import { AUTH_USER_STORAGE_KEY } from "@/src/lib/auth/constants";

interface StoredUser {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  account_type?: string;
  status?: string;
}

interface StoredAuthData {
  user?: StoredUser;
  institution?: unknown;
}

export function useAdminUser() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);

        if (!raw) {
          setUser(null);
          return;
        }

        const parsed = JSON.parse(raw) as StoredAuthData;

        setUser(parsed.user ?? null);
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return user;
}
