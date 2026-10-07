'use client';

import { useEffect, useRef } from 'react';

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    // Trigger genuine view increment after 1.5 seconds of page stay (reading intent)
    const timer = setTimeout(() => {
      fetch(`/api/views/${encodeURIComponent(slug)}`, {
        method: 'POST',
      }).catch(() => {
        // Silently ignore network failures
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
