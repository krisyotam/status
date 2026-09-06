import Link from 'next/link';
import Image from 'next/image';
import { AutoRefresh } from '@/components/auto-refresh';
import { ClusterMatrix } from '@/components/cluster-matrix';
import { StatusMark } from '@/components/status-mark';
import { ThemeToggle } from '@/components/theme-toggle';
import { getStatusDashboard } from '@/lib/gatus';

export const revalidate = 30;

function timezoneLabel() {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    timeZoneName: 'short',
  })
    .formatToParts(new Date())
    .find(({ type }) => type === 'timeZoneName');
  return part?.value ?? 'CT';
}

export default async function Home() {
  const dashboard = await getStatusDashboard();
  const activeIncident = dashboard.announcements.find(
    (announcement) => !announcement.archived,
  );

  return (
    <>
      <AutoRefresh fetchedAt={dashboard.fetchedAt} />
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Service Status home">
            <Image src="/favicon.png" alt="" width="30" height="30" priority />
            <span>Service Status</span>
          </Link>
          <nav className="utility-nav" aria-label="Status utilities">
            <span className="utility-pill">
              Time: {timezoneLabel()}
              <span className="clock-mark" aria-hidden="true" />
            </span>
            <Link className="utility-pill rss-link" href="/feed.xml">
              RSS Feed <span aria-hidden="true">◔</span>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="page-shell">
        <h1>Service Status</h1>
        <section
          className={`system-banner ${activeIncident ? `is-${activeIncident.type}` : 'is-operational'}`}
          aria-live="polite"
        >
          <StatusMark level={activeIncident ? activeIncident.type : 'available'} size="large" />
          <div>
            <h2>{activeIncident?.message ?? 'No incidents declared'}</h2>
            <p>
              {activeIncident
                ? 'We are actively investigating an incident affecting one or more services.'
                : 'We are not actively mitigating any known incidents at this time.'}
            </p>
          </div>
        </section>

        <section className="section-block" aria-labelledby="live-data-heading">
          <div className="section-heading">
            <h2 id="live-data-heading">Live service data</h2>
            <p>
              This section shows live data exported from our monitoring system. It
              indicates service health even if no incidents have been declared.
            </p>
          </div>
          <ClusterMatrix />
        </section>

        <section className="section-block" aria-labelledby="services-heading">
          <div className="section-heading services-heading">
            <h2 id="services-heading">Services</h2>
            {!dashboard.connected && (
              <p className="connection-note">
                Live monitoring is temporarily unavailable. Showing the service catalogue.
              </p>
            )}
          </div>
          <div className="service-grid">
            {dashboard.services.map((service) => (
              <Link
                className="service-card"
                href={`/services/${service.slug}`}
                key={service.key}
              >
                <span>{service.name}</span>
                <span className={`status-pill is-${service.level}`}>{service.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
