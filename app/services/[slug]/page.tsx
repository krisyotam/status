import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IncidentCard } from '@/components/incident-card';
import { ServiceBanner } from '@/components/service-banner';
import { SiteHeader } from '@/components/site-header';
import { UptimeStrip } from '@/components/uptime-strip';
import { formatUptime } from '@/lib/format';
import { getServiceDetails } from '@/lib/gatus';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getServiceDetails(slug);
  if (!detail) return { title: 'Service not found · Status' };
  const description = `Live availability and recent incident history for ${detail.service.name}.`;
  return {
    title: `${detail.service.name} · Status`,
    description,
    openGraph: { title: `${detail.service.name} · Status`, description, images: ['/status-social-preview.png'] },
    twitter: { card: 'summary_large_image', title: `${detail.service.name} · Status`, description, images: ['/status-social-preview.png'] },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getServiceDetails(slug);
  if (!detail) notFound();

  const cutoffDate = detail.days[0]?.date ?? '';
  const monthIncidents = detail.incidents.filter(
    (incident) => incident.startedAt.slice(0, 10) >= cutoffDate,
  );

  return (
    <>
      <SiteHeader />
      <main className="page-shell detail-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Overview</Link><span aria-hidden="true">/</span><span>{detail.service.name}</span>
        </nav>
        <h1>{detail.service.name}</h1>
        <ServiceBanner service={detail.service} />

        <section className="summary-grid" aria-label="30 day service summary">
          <div className="summary-card">
            <h2>Up Time <span>30 Days</span></h2>
            <UptimeStrip days={detail.days} />
            <p className="summary-value">{formatUptime(detail.uptime)}</p>
          </div>
          <div className="summary-card issues-summary">
            <h2>Issues <span>30 Days</span></h2>
            <div className="issue-counts">
              <span><i className="incident-dot is-amber" /> <b>0</b> Disruption</span>
              <span><i className="incident-dot is-blue" /> <b>0</b> Info</span>
              <span><i className="incident-dot" /> <b>{monthIncidents.length}</b> Outage</span>
            </div>
          </div>
        </section>

        <section className="past-issues" aria-labelledby="past-issues-heading">
          <h2 id="past-issues-heading">Past Issues</h2>
          <div className="incident-list">
            {detail.incidents.length ? (
              detail.incidents.map((incident) => <IncidentCard incident={incident} key={incident.id} />)
            ) : (
              <div className="empty-card">No incidents have been recorded for this service.</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
