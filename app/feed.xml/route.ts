import { formatDuration } from '@/lib/format';
import { getAllIncidents } from '@/lib/gatus';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const incidents = await getAllIncidents();
  const items = incidents.slice(0, 50).map((incident) => {
    const link = `https://status.krisyotam.com/incidents/${incident.serviceSlug}/${Date.parse(incident.startedAt)}`;
    const description = `${incident.status === 'resolved' ? 'Resolved' : 'Investigating'} · Duration: ${formatDuration(incident.durationMs)} · ${incident.serviceName}`;
    return `<item><title>${escapeXml(incident.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${new Date(incident.startedAt).toUTCString()}</pubDate><description>${escapeXml(description)}</description></item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>krisyotam.com Status</title><link>https://status.krisyotam.com</link><description>Availability incidents for krisyotam.com services.</description><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
