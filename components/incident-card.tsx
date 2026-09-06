import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';
import { FormattedDateTime } from '@/components/formatted-date-time';
import { formatDuration } from '@/lib/format';
import type { StatusIncident } from '@/lib/gatus';

export function IncidentCard({ incident }: { incident: StatusIncident }) {
  return (
    <Link
      className="incident-card"
      href={`/incidents/${incident.serviceSlug}/${Date.parse(incident.startedAt)}`}
    >
      <FormattedDateTime value={incident.startedAt} />
      <div className="incident-title">
        <span className="incident-dot" aria-hidden="true" />
        <strong>{incident.title}</strong>
      </div>
      <div className="incident-meta">
        <span className="resolved-mark" aria-hidden="true"><Check size={10} strokeWidth={3} /></span>
        <span>{incident.status === 'resolved' ? 'Resolved' : 'Investigating'}</span>
        <span aria-hidden="true">·</span>
        <span>Duration: {formatDuration(incident.durationMs)}</span>
        <span aria-hidden="true">·</span>
        <span>Outage</span>
      </div>
      <ChevronRight className="incident-chevron" aria-hidden="true" size={17} strokeWidth={1.8} />
    </Link>
  );
}
