import { describe, expect, it } from 'vitest';
import { STARGATE_ENDPOINTS, STARGATE_MACHINES } from './stargate';

describe('Stargate machine topology', () => {
  it('defines the three us-central machines', () => {
    expect(STARGATE_MACHINES.map((machine) => machine.id)).toEqual([
      'us-central-1',
      'us-central-2',
      'us-central-3',
    ]);
    expect(STARGATE_ENDPOINTS).toHaveLength(3);
  });

  it('reserves us-central-3 for local-model inference', () => {
    expect(STARGATE_MACHINES.map(({ role, focus }) => ({ role, focus }))).toEqual([
      { role: 'Server', focus: 'non-inference' },
      { role: 'Server', focus: 'non-inference' },
      { role: 'Local model', focus: 'inference' },
    ]);
  });
});
