import { describe, expect, it } from 'vitest';
import {
  incidentsFromEvents,
  serviceLevel,
  slugify,
  uptimeDays,
  type StatusService,
} from './status-model';

const service: StatusService = {
  name: 'gist.krisyotam.com',
  group: 'websites',
  key: 'websites_gist-krisyotam-com',
  slug: 'gist-krisyotam-com',
  level: 'available',
  label: 'Available',
  checkedAt: null,
};

describe('serviceLevel', () => {
  it('fails closed when no checks are available', () => {
    expect(serviceLevel([])).toBe('unknown');
  });

  it('uses the three most recent checks', () => {
    expect(serviceLevel([{ success: false }, { success: true }, { success: true }, { success: true }])).toBe('available');
    expect(serviceLevel([{ success: true }, { success: false }, { success: true }])).toBe('degraded');
    expect(serviceLevel([{ success: false }, { success: false }, { success: false }])).toBe('unavailable');
  });
});

describe('incident normalization', () => {
  it('pairs unhealthy and healthy events into a resolved incident', () => {
    const incidents = incidentsFromEvents(service, [
      { type: 'HEALTHY', timestamp: '2026-09-01T00:00:00.000Z' },
      { type: 'UNHEALTHY', timestamp: '2026-09-02T12:00:00.000Z' },
      { type: 'UNHEALTHY', timestamp: '2026-09-02T12:01:00.000Z' },
      { type: 'HEALTHY', timestamp: '2026-09-02T12:05:00.000Z' },
    ]);
    expect(incidents).toHaveLength(1);
    expect(incidents[0]).toMatchObject({ status: 'resolved', durationMs: 300_000 });
  });

  it('keeps an unmatched unhealthy event open', () => {
    const incidents = incidentsFromEvents(service, [
      { type: 'UNHEALTHY', timestamp: '2026-09-05T12:00:00.000Z' },
    ]);
    expect(incidents[0]).toMatchObject({ status: 'investigating', resolvedAt: null });
  });
});

describe('uptimeDays', () => {
  it('returns 30 ordered days and marks overlapping outages', () => {
    const incidents = incidentsFromEvents(service, [
      { type: 'UNHEALTHY', timestamp: '2026-09-02T23:59:00.000Z' },
      { type: 'HEALTHY', timestamp: '2026-09-03T00:01:00.000Z' },
    ]);
    const days = uptimeDays(incidents, new Date('2026-09-06T12:00:00.000Z'));
    expect(days).toHaveLength(30);
    expect(days.at(-1)?.date).toBe('2026-09-06');
    expect(days.filter((day) => day.level === 'outage').map((day) => day.date)).toEqual([
      '2026-09-02',
      '2026-09-03',
    ]);
  });
});

it('creates stable URL slugs', () => {
  expect(slugify('Gist.KrisYotam.com')).toBe('gist-krisyotam-com');
});
