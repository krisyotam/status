import type { Metadata } from 'next';
import Link from 'next/link';
import { IncidentCard } from '@/components/incident-card';
import { SiteHeader } from '@/components/site-header';
import { getAllIncidents } from '@/lib/gatus';

export const metadata: Metadata = {
  title: 'Incident History · Status',
  description: 'Recent availability incidents across krisyotam.com services.',
  openGraph: { images: ['/status-social-preview.png'] },
  twitter: { card: 'summary_large_image', images: ['/status-social-preview.png'] },
};

export default async function HistoryPage() {
  const incidents = await getAllIncidents();
  return (
    <>
      <SiteHeader />
      <main className="page-shell detail-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Overview</Link><span aria-hidden="true">/</span><span>History</span>
        </nav>
        <h1>Incident History</h1>
        <p className="page-intro">Availability events reported by the live monitoring system.</p>
        <section className="incident-list history-list" aria-label="Past incidents">
          {incidents.length ? (
            incidents.map((incident) => <IncidentCard incident={incident} key={incident.id} />)
          ) : (
            <div className="empty-card">No incidents are currently available.</div>
          )}
        </section>
      </main>
    </>
  );
}
