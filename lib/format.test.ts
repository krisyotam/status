import { describe, expect, it } from 'vitest';
import { formatDateTime, formatDuration, formatUptime } from './format';

describe('formatDateTime', () => {
  it('defaults to fixed Central Standard Time and supports selected zones', () => {
    const date = '2026-09-06T18:30:00.000Z';
    expect(formatDateTime(date)).toBe('Sep 6, 2026, 12:30 PM CST');
    expect(formatDateTime(date, 'Etc/GMT+8', 'PST')).toBe('Sep 6, 2026, 10:30 AM PST');
  });
});

describe('formatDuration', () => {
  it('formats short and multi-day outages', () => {
    expect(formatDuration(30_000)).toBe('1m');
    expect(formatDuration(3 * 86_400_000 + 3 * 3_600_000 + 38 * 60_000)).toBe('3d 3h 38m');
    expect(formatDuration(null)).toBe('Ongoing');
  });
});

describe('formatUptime', () => {
  it('formats ratios as percentages', () => {
    expect(formatUptime(1)).toBe('100%');
    expect(formatUptime(0.9975)).toBe('99.75%');
    expect(formatUptime(null)).toBe('—');
  });
});
