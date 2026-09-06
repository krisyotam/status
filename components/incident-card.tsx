import Link from 'next/link';
import { formatDateTime, formatDuration } from '@/lib/format';
import type { StatusIncident } from '@/lib/gatus';

export function IncidentCard({ incident }: { incident: StatusIncident }) {
  return (
    <Link
      className="incident-card"
      href={`/incidents/${incident.serviceSlug}/${Date.parse(incident.startedAt)}`}
    >
      <time dateTime={incident.startedAt}>{formatDateTime(incident.startedAt)}</time>
      <div className="incident-title">
        <span className="incident-dot" aria-hidden="true" />
        <strong>{incident.title}</strong>
      </div>
      <div className="incident-meta">
        <span className="resolved-mark" aria-hidden="true">✓</span>
        <span>{incident.status === 'resolved' ? 'Resolved' : 'Investigating'}</span>
        <span aria-hidden="true">·</span>
        <span>Duration: {formatDuration(incident.durationMs)}</span>
        <span aria-hidden="true">·</span>
        <span>Outage</span>
      </div>
      <span className="incident-chevron" aria-hidden="true">›</span>
    </Link>
  );
}
