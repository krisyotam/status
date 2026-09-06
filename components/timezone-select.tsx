'use client';

import { ChevronDown, Clock3 } from 'lucide-react';
import { useTimezone } from '@/components/timezone-provider';
import { TIMEZONE_OPTIONS, type TimezoneId } from '@/lib/timezones';

export function TimezoneSelect() {
  const { id, setTimezone } = useTimezone();

  return (
    <label className="utility-pill timezone-control">
      <Clock3 aria-hidden="true" size={14} strokeWidth={1.8} />
      <span>Time:</span>
      <select
        aria-label="Display timezone"
        value={id}
        onChange={(event) => setTimezone(event.target.value as TimezoneId)}
      >
        {TIMEZONE_OPTIONS.map((option) => (
          <option value={option.id} key={option.id}>{option.id}</option>
        ))}
      </select>
      <ChevronDown className="timezone-chevron" aria-hidden="true" size={13} strokeWidth={2} />
    </label>
  );
}
