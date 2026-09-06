import { describe, expect, it } from 'vitest';
import { formatDuration, formatUptime } from './format';

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
