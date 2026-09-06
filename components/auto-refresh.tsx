'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AutoRefresh({ fetchedAt }: { fetchedAt: string }) {
  const router = useRouter();
  useEffect(() => {
    const timeout = window.setTimeout(() => router.refresh(), 30_000);
    return () => window.clearTimeout(timeout);
  }, [fetchedAt, router]);
  return null;
}
