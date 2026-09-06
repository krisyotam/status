import { getAllIncidents } from '@/lib/gatus';
import { buildRssFeed } from '@/lib/rss';

export async function GET() {
  const incidents = await getAllIncidents();
  const xml = buildRssFeed(incidents);
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
