"use client";

import { useState, useEffect } from "react";
import { getMyProfile } from "@/lib/api/auth";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p) {
        setUser({
          id: p.id,
          fullName: p.full_name,
          email: p.email,
          avatarUrl: (p as any).avatar_url || "",
          role: p.role,
        });
      }
    });
  }, []);

  return user;
}
