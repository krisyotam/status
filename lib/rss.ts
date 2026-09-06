import { formatDuration } from './format';
import type { StatusIncident } from './status-model';

const SITE_URL = 'https://status.krisyotam.com';

export function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function incidentItem(incident: StatusIncident) {
  const link = `${SITE_URL}/incidents/${incident.serviceSlug}/${Date.parse(incident.startedAt)}`;
  const state = incident.status === 'resolved' ? 'Resolved' : 'Investigating';
  const description = `${state} · Duration: ${formatDuration(incident.durationMs)} · ${incident.serviceName}`;

  return [
    '    <item>',
    `      <title>${escapeXml(incident.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    `      <pubDate>${new Date(incident.startedAt).toUTCString()}</pubDate>`,
    `      <category>${state}</category>`,
    `      <description>${escapeXml(description)}</description>`,
    '    </item>',
  ].join('\n');
}

export function buildRssFeed(incidents: StatusIncident[], now = new Date()) {
  const recent = [...incidents]
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 50);
  const lastBuildDate = recent[0]?.startedAt ?? now.toISOString();
  const items = recent.map(incidentItem).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>krisyotam.com Status</title>',
    `    <link>${SITE_URL}</link>`,
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Availability incidents for krisyotam.com services.</description>',
    '    <language>en-us</language>',
    '    <generator>krisyotam.com Status</generator>',
    `    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>`,
    '    <ttl>1</ttl>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].filter((line) => line !== '').join('\n');
}
