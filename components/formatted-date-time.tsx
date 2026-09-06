'use client';

import { useTimezone } from '@/components/timezone-provider';
import { formatDateTime } from '@/lib/format';

export function FormattedDateTime({ value }: { value: string }) {
  const { id, timeZone } = useTimezone();
  return <time dateTime={value}>{formatDateTime(value, timeZone, id)}</time>;
}
