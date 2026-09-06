import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { formatDateTime, formatDuration } from '@/lib/format';
import { getIncident } from '@/lib/gatus';

type PageProps = { params: Promise<{ service: string; startedAtMs: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service, startedAtMs } = await params;
  const incident = await getIncident(service, startedAtMs);
  if (!incident) return { title: 'Incident not found · Status' };
  const description = `${incident.status === 'resolved' ? 'Resolved' : 'Investigating'} availability incident for ${incident.serviceName}.`;
  return {
    title: `${incident.title} · Status`,
    description,
    openGraph: { title: incident.title, description, images: ['/status-social-preview.png'] },
    twitter: { card: 'summary_large_image', title: incident.title, description, images: ['/status-social-preview.png'] },
  };
}

export default async function IncidentPage({ params }: PageProps) {
  const { service, startedAtMs } = await params;
  const incident = await getIncident(service, startedAtMs);
  if (!incident) notFound();
  return (
    <>
      <SiteHeader />
      <main className="page-shell detail-shell incident-detail-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Overview</Link><span aria-hidden="true">/</span>
          <Link href={`/services/${incident.serviceSlug}`}>{incident.serviceName}</Link>
          <span aria-hidden="true">/</span><span>Incident</span>
        </nav>
        <div className="incident-detail-heading">
          <span className="incident-dot" aria-hidden="true" />
          <div>
            <p>{formatDateTime(incident.startedAt)}</p>
            <h1>{incident.title}</h1>
          </div>
        </div>
        <section className="incident-detail-card">
          <div className="incident-detail-state">
            <span className="resolved-mark" aria-hidden="true"><Check size={10} strokeWidth={3} /></span>
            <strong>{incident.status === 'resolved' ? 'Resolved' : 'Investigating'}</strong>
          </div>
          <p>
            {incident.status === 'resolved'
              ? `Monitoring detected that ${incident.serviceName} had recovered after ${formatDuration(incident.durationMs)}.`
              : `Monitoring is currently reporting that ${incident.serviceName} is unavailable.`}
          </p>
          <dl>
            <div><dt>Started</dt><dd>{formatDateTime(incident.startedAt)}</dd></div>
            <div><dt>Resolved</dt><dd>{incident.resolvedAt ? formatDateTime(incident.resolvedAt) : 'Ongoing'}</dd></div>
            <div><dt>Duration</dt><dd>{formatDuration(incident.durationMs)}</dd></div>
            <div><dt>Affected service</dt><dd><Link href={`/services/${incident.serviceSlug}`}>{incident.serviceName}</Link></dd></div>
          </dl>
        </section>
      </main>
    </>
  );
}
