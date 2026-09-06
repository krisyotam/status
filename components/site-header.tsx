import Image from 'next/image';
import Link from 'next/link';
import { Rss } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { TimezoneSelect } from '@/components/timezone-select';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Status home">
          <Image src="/favicon.png" alt="" width="30" height="30" priority />
          <span>Status</span>
        </Link>
        <nav className="utility-nav" aria-label="Status utilities">
          <TimezoneSelect />
          <Link className="utility-pill rss-link" href="/feed.xml" aria-label="Open RSS feed">
            RSS Feed <Rss aria-hidden="true" size={14} strokeWidth={1.9} />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
