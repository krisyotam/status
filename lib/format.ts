export function formatDateTime(
  value: string,
  timeZone = 'Etc/GMT+6',
  timeZoneLabel = 'CST',
) {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
  return `${formatted} ${timeZoneLabel}`;
}

export function formatDuration(durationMs: number | null) {
  if (durationMs === null) return 'Ongoing';
  const totalMinutes = Math.max(1, Math.round(durationMs / 60_000));
  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || parts.length === 0) parts.push(`${minutes}m`);
  return parts.join(' ');
}

export function formatUptime(value: number | null) {
  if (value === null) return '—';
  return `${(value * 100).toFixed(value === 1 ? 0 : 2)}%`;
}
