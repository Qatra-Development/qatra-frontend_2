"use client";

import { useEffect, useState } from "react";

interface StoredUser {
  id?: number;
  name?: string;

  email?: string;
  phone?: string;

  account_type?: string;
  status?: string;

  avatar_url?: string | null;
  image_url?: string | null;
}

interface StoredInstitution {
  id?: number;

  institution_name?: string;
  institution_type?: string;

  license_number?: string;

  service_scope?: string;
  status?: string;
}

interface StoredAuth {
  user?: StoredUser;

  institution?: StoredInstitution;
}

const STORAGE_KEY = "qatra:auth:user";

export function useInstitutionIdentity() {
  const [auth, setAuth] = useState<StoredAuth | null>(null);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
          setAuth(null);
          return;
        }

        setAuth(JSON.parse(raw));
      } catch {
        setAuth(null);
      }
    }

    load();

    window.addEventListener("storage", load);

    return () => window.removeEventListener("storage", load);
  }, []);

  return {
    user: auth?.user ?? null,

    institution: auth?.institution ?? null,
  };
}
