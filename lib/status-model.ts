export type ServiceLevel = 'available' | 'degraded' | 'unavailable' | 'unknown';
export type IncidentType = 'outage' | 'warning' | 'information' | 'operational' | 'none';
export type StatusEvent = {
  type?: 'START' | 'HEALTHY' | 'UNHEALTHY';
  timestamp?: string;
};
export type StatusService = {
  name: string;
  group: string;
  key: string;
  slug: string;
  level: ServiceLevel;
  label: 'Available' | 'Degraded' | 'Unavailable' | 'Unknown';
  checkedAt: string | null;
};
export type StatusIncident = {
  id: string;
  serviceName: string;
  serviceSlug: string;
  startedAt: string;
  resolvedAt: string | null;
  durationMs: number | null;
  status: 'resolved' | 'investigating';
  type: 'outage';
  title: string;
};
export type UptimeDay = { date: string; level: 'available' | 'outage' };

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function serviceLevel(results: Array<{ success?: boolean }>): ServiceLevel {
  if (results.length === 0) return 'unknown';
  const recent = results.slice(-3);
  const successes = recent.filter((result) => result.success).length;
  if (successes === recent.length) return 'available';
  if (successes === 0) return 'unavailable';
  return 'degraded';
}

export function serviceLabel(level: ServiceLevel): StatusService['label'] {
  if (level === 'available') return 'Available';
  if (level === 'degraded') return 'Degraded';
  if (level === 'unavailable') return 'Unavailable';
  return 'Unknown';
}

function normalizeEvents(events: StatusEvent[]) {
  return events
    .filter((event): event is Required<StatusEvent> => Boolean(event.type && event.timestamp))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function incidentsFromEvents(
  service: StatusService,
  rawEvents: StatusEvent[],
): StatusIncident[] {
  const events = normalizeEvents(rawEvents);
  const incidents: StatusIncident[] = [];
  let startedAt: string | null = null;

  for (const event of events) {
    if (event.type === 'UNHEALTHY') {
      startedAt ??= event.timestamp;
    } else if (event.type === 'HEALTHY' && startedAt) {
      const durationMs = Math.max(0, Date.parse(event.timestamp) - Date.parse(startedAt));
      incidents.push({
        id: `${service.slug}-${Date.parse(startedAt)}`,
        serviceName: service.name,
        serviceSlug: service.slug,
        startedAt,
        resolvedAt: event.timestamp,
        durationMs,
        status: 'resolved',
        type: 'outage',
        title: `${service.name} was temporarily unavailable`,
      });
      startedAt = null;
    }
  }

  if (startedAt) {
    incidents.push({
      id: `${service.slug}-${Date.parse(startedAt)}`,
      serviceName: service.name,
      serviceSlug: service.slug,
      startedAt,
      resolvedAt: null,
      durationMs: null,
      status: 'investigating',
      type: 'outage',
      title: `${service.name} is currently unavailable`,
    });
  }
  return incidents.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function uptimeDays(
  incidents: StatusIncident[],
  now = new Date(),
  currentTimeMs = now.getTime(),
): UptimeDay[] {
  const days: UptimeDay[] = [];
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let offset = 29; offset >= 0; offset -= 1) {
    const startMs = end - offset * 86_400_000;
    const endMs = startMs + 86_400_000;
    const hasOutage = incidents.some((incident) => {
      const incidentStart = Date.parse(incident.startedAt);
      const incidentEnd = incident.resolvedAt ? Date.parse(incident.resolvedAt) : currentTimeMs;
      return incidentStart < endMs && incidentEnd >= startMs;
    });
    days.push({
      date: new Date(startMs).toISOString().slice(0, 10),
      level: hasOutage ? 'outage' : 'available',
    });
  }
  return days;
}
