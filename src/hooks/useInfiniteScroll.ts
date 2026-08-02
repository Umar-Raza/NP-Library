"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // callback ko ref mein rakhte hain taake observer baar baar na bane
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cbRef.current();
        }
      },
      { rootMargin: "200px" }, // 200px pehle hi load shuru (smooth feel)
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
