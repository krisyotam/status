import 'server-only';

export type ServiceLevel = 'available' | 'degraded' | 'unavailable' | 'unknown';
export type IncidentType = 'outage' | 'warning' | 'information' | 'operational' | 'none';

type GatusResult = { success?: boolean; timestamp?: string };
type GatusEndpoint = {
  name?: string;
  group?: string;
  key?: string;
  results?: GatusResult[];
};
type GatusAnnouncement = {
  timestamp?: string;
  type?: IncidentType;
  message?: string;
  archived?: boolean;
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

const fallbackServiceNames = [
  'krisyotam.com', 'notes.krisyotam.com', 'videos.krisyotam.com',
  'git.krisyotam.com', 'gist.krisyotam.com', 'shop.krisyotam.com', 'photos.krisyotam.com',
];

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function serviceLevel(results: GatusResult[]): ServiceLevel {
  if (results.length === 0) return 'unknown';
  const recent = results.slice(-3);
  const successes = recent.filter((result) => result.success).length;
  if (successes === recent.length) return 'available';
  if (successes === 0) return 'unavailable';
  return 'degraded';
}

function serviceLabel(level: ServiceLevel): StatusService['label'] {
  if (level === 'available') return 'Available';
  if (level === 'degraded') return 'Degraded';
  if (level === 'unavailable') return 'Unavailable';
  return 'Unknown';
}

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

export async function getStatusDashboard(): Promise<StatusDashboard> {
  const baseUrl = (process.env.GATUS_URL ?? 'https://status.krisyotam.com').replace(/\/$/, '');
  try {
    const [statusesResponse, configResponse] = await Promise.all([
      fetch(`${baseUrl}/api/v1/endpoints/statuses`, {
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(4_500),
      }),
      fetch(`${baseUrl}/api/v1/config`, {
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(4_500),
      }),
    ]);
    if (!statusesResponse.ok) throw new Error(`Gatus returned ${statusesResponse.status}`);
    const statuses: unknown = await statusesResponse.json();
    const config: unknown = configResponse.ok ? await configResponse.json() : null;
    if (!Array.isArray(statuses)) throw new Error('Invalid Gatus status payload');
    return {
      connected: true,
      fetchedAt: new Date().toISOString(),
      services: (statuses as GatusEndpoint[]).map(normalizeEndpoint).sort((a, b) => a.name.localeCompare(b.name)),
      announcements: normalizeAnnouncements(config),
    };
  } catch {
    return fallbackDashboard();
  }
}
