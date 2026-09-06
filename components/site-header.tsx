import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

function timezoneLabel() {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    timeZoneName: 'short',
  })
    .formatToParts(new Date())
    .find(({ type }) => type === 'timeZoneName');
  return part?.value ?? 'CT';
}

export function SiteHeader() {
  return (
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
  );
}
