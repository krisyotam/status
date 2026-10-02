import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/status-model', async () => import('./status-model'));
import { getServiceDetails } from './gatus';

const endpoint = {
  name: 'example.test',
  key: 'services_example-test',
  results: [{ success: true, timestamp: '2026-10-02T12:00:00Z' }],
};

function stubGatus(detail: () => Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    if (input.endsWith('/endpoints/statuses')) return Response.json([endpoint]);
    if (input.endsWith('/config')) return Response.json({});
    if (input.endsWith('/uptimes/30d')) return Response.json(1);
    return detail();
  }));
}

afterEach(() => vi.unstubAllGlobals());

describe('incident history availability', () => {
  it('does not manufacture a healthy month when the history request fails', async () => {
    stubGatus(async () => new Response(null, { status: 503 }));
    const detail = await getServiceDetails('example-test');
    expect(detail).not.toBeNull();
    expect(detail?.days).toEqual([]);
    expect(detail?.historyAvailable).toBe(false);
    expect(detail?.uptime).toBeNull();
    expect(detail?.service.level).toBe('available');
  });

  it('preserves the service when the history payload is invalid', async () => {
    stubGatus(async () => Response.json(null));
    const detail = await getServiceDetails('example-test');
    expect(detail).not.toBeNull();
    expect(detail?.days).toEqual([]);
    expect(detail?.historyAvailable).toBe(false);
  });

  it('distinguishes a successful empty history from a failed request', async () => {
    stubGatus(async () => Response.json({ ...endpoint, events: [] }));
    const detail = await getServiceDetails('example-test');
    expect(detail?.historyAvailable).toBe(true);
    expect(detail?.days).toHaveLength(30);
    expect(detail?.days.every((day) => day.level === 'available')).toBe(true);
    expect(detail?.uptime).toBe(1);
  });
});
