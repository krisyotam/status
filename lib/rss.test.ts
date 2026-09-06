import { describe, expect, it } from 'vitest';
import { buildRssFeed, escapeXml } from './rss';
import type { StatusIncident } from './status-model';

function incident(overrides: Partial<StatusIncident>): StatusIncident {
  return {
    id: 'site-1',
    serviceName: 'site.example',
    serviceSlug: 'site-example',
    startedAt: '2026-09-06T18:00:00.000Z',
    resolvedAt: '2026-09-06T18:05:00.000Z',
    durationMs: 300_000,
    status: 'resolved',
    type: 'outage',
    title: 'site.example was unavailable',
    ...overrides,
  };
}

describe('RSS feed', () => {
  it('escapes XML-sensitive text', () => {
    expect(escapeXml('Status & <alerts>')).toBe('Status &amp; &lt;alerts&gt;');
  });

  it('orders incidents newest-first and includes feed metadata', () => {
    const xml = buildRssFeed([
      incident({ id: 'older', title: 'Older incident', startedAt: '2026-09-05T18:00:00.000Z' }),
      incident({ id: 'newer', title: 'Newer incident' }),
    ]);

    expect(xml).toContain('<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>');
    expect(xml).toContain('<atom:link href="https://status.krisyotam.com/feed.xml"');
    expect(xml.indexOf('Newer incident')).toBeLessThan(xml.indexOf('Older incident'));
  });
});
