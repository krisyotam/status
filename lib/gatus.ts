import 'server-only';
import {
  incidentsFromEvents,
  serviceLabel,
  serviceLevel,
  slugify,
  uptimeDays,
  type IncidentType,
  type StatusEvent,
  type StatusIncident,
  type StatusService,
  type UptimeDay,
} from '@/lib/status-model';

export type {
  IncidentType,
  ServiceLevel,
  StatusIncident,
  StatusService,
  UptimeDay,
} from '@/lib/status-model';

type GatusResult = { success?: boolean; timestamp?: string };
type GatusEndpoint = {
  name?: string;
  group?: string;
  key?: string;
  results?: GatusResult[];
  events?: StatusEvent[];
};
type GatusAnnouncement = {
  timestamp?: string;
  type?: IncidentType;
  message?: string;
  archived?: boolean;
};

export type StatusAnnouncement = {
  timestamp: string;
  type: IncidentType;
  message: string;
  archived: boolean;
};

export type StatusDashboard = {
  connected: boolean;
  fetchedAt: string;
  services: StatusService[];
  announcements: StatusAnnouncement[];
};

export type ServiceDetails = {
  service: StatusService;
  uptime: number | null;
  days: UptimeDay[];
  incidents: StatusIncident[];
};

const fallbackServiceNames = [
  'krisyotam.com',
  'notes.krisyotam.com',
  'videos.krisyotam.com',
  'git.krisyotam.com',
  'gist.krisyotam.com',
  'shop.krisyotam.com',
  'photos.krisyotam.com',
];

function normalizeEndpoint(endpoint: GatusEndpoint, index: number): StatusService {
  const name = endpoint.name?.trim() || `Service ${index + 1}`;
  const results = Array.isArray(endpoint.results) ? endpoint.results : [];
  const level = serviceLevel(results);
  return {
    name,
    group: endpoint.group?.trim() || 'services',
    key: endpoint.key?.trim() || `${slugify(name)}-${index}`,
    slug: slugify(name),
    level,
    label: serviceLabel(level),
    checkedAt: results.at(-1)?.timestamp ?? null,
  };
}

function normalizeAnnouncements(value: unknown): StatusAnnouncement[] {
  if (!value || typeof value !== 'object' || !('announcements' in value)) return [];
  const announcements = (value as { announcements?: unknown }).announcements;
  if (!Array.isArray(announcements)) return [];
  return (announcements as GatusAnnouncement[])
    .filter((item) => typeof item.message === 'string')
    .map((item) => ({
      timestamp: item.timestamp ?? new Date(0).toISOString(),
      type: item.type ?? 'none',
      message: item.message ?? '',
      archived: Boolean(item.archived),
    }))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function fallbackDashboard(): StatusDashboard {
  const fetchedAt = new Date().toISOString();
  return {
    connected: false,
    fetchedAt,
    announcements: [],
    services: fallbackServiceNames.map((name, index) => ({
      name,
      group: 'websites',
      key: `websites_${slugify(name)}-${index}`,
      slug: slugify(name),
      level: 'unknown',
      label: 'Unknown',
      checkedAt: null,
    })),
  };
}

function gatusBaseUrl() {
  return (process.env.GATUS_URL ?? 'https://status.krisyotam.com').replace(/\/$/, '');
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${gatusBaseUrl()}${path}`, {
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(4_500),
  });
  if (!response.ok) throw new Error(`Gatus returned ${response.status}`);
  return response.json();
}

export async function getStatusDashboard(): Promise<StatusDashboard> {
  try {
    const [statuses, config] = await Promise.all([
      fetchJson('/api/v1/endpoints/statuses'),
      fetchJson('/api/v1/config').catch(() => null),
    ]);
    if (!Array.isArray(statuses)) throw new Error('Invalid Gatus status payload');
    return {
      connected: true,
      fetchedAt: new Date().toISOString(),
      services: (statuses as GatusEndpoint[])
        .map(normalizeEndpoint)
        .sort((a, b) => a.name.localeCompare(b.name)),
      announcements: normalizeAnnouncements(config),
    };
  } catch {
    return fallbackDashboard();
  }
}

export async function getServiceDetails(slug: string): Promise<ServiceDetails | null> {
  const dashboard = await getStatusDashboard();
  const service = dashboard.services.find((candidate) => candidate.slug === slug);
  if (!service || !dashboard.connected) return null;

  try {
    const [endpointPayload, uptimePayload] = await Promise.all([
      fetchJson(`/api/v1/endpoints/${encodeURIComponent(service.key)}/statuses`),
      fetchJson(`/api/v1/endpoints/${encodeURIComponent(service.key)}/uptimes/30d`).catch(() => null),
    ]);
    if (!endpointPayload || typeof endpointPayload !== 'object') return null;
    const endpoint = endpointPayload as GatusEndpoint;
    const incidents = incidentsFromEvents(
      service,
      Array.isArray(endpoint.events) ? endpoint.events : [],
    );
    return {
      service,
      uptime: typeof uptimePayload === 'number' ? uptimePayload : null,
      days: uptimeDays(incidents),
      incidents,
    };
  } catch {
    return { service, uptime: null, days: uptimeDays([]), incidents: [] };
  }
}

export async function getAllIncidents(): Promise<StatusIncident[]> {
  const dashboard = await getStatusDashboard();
  if (!dashboard.connected) return [];
  const details = await Promise.all(dashboard.services.map((service) => getServiceDetails(service.slug)));
  return details
    .flatMap((detail) => detail?.incidents ?? [])
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export async function getIncident(
  serviceSlug: string,
  startedAtMs: string,
): Promise<StatusIncident | null> {
  const details = await getServiceDetails(serviceSlug);
  if (!details) return null;
  return details.incidents.find((incident) => String(Date.parse(incident.startedAt)) === startedAtMs) ?? null;
}
