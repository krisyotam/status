import {
  STARGATE_ENDPOINTS,
  STARGATE_MACHINES,
  type StargateRouteHealth,
  type StargateWorkload,
} from '@/lib/stargate';

function displayPercent(value: number | null) {
  if (value === null) return '—';
  return value === 100 ? '100%' : `${value.toFixed(2)}%`;
}

function metricEntries(endpoint: StargateRouteHealth) {
  return [
    ['inference', endpoint.inference],
    ['non-inference', endpoint.nonInference],
  ] as const satisfies ReadonlyArray<readonly [StargateWorkload, number | null]>;
}

export function ClusterMatrix() {
  return (
    <div className="matrix-scroll" role="region" aria-label="Stargate cluster availability" tabIndex={0}>
      <div className="cluster-matrix">
        <div className="matrix-title" aria-hidden="true">
          <span /><span className="endpoint-title">Endpoint</span>
        </div>
        <div className="matrix-head">
          <span>Source</span>
          {STARGATE_ENDPOINTS.map((endpoint) => <span key={endpoint}>{endpoint}</span>)}
        </div>
        {STARGATE_MACHINES.map((machine) => (
          <div className="matrix-row" key={machine.id}>
            <span className="matrix-source">
              <strong>{machine.id}</strong>
              <small>{machine.role}</small>
            </span>
            {machine.endpoints.map((endpoint, endpointIndex) => (
              <div className="matrix-cell" key={`${machine.id}-${STARGATE_ENDPOINTS[endpointIndex]}`}>
                {metricEntries(endpoint).map(([workload, value]) => (
                  <div
                    className={`matrix-metric ${value === null ? 'is-unassigned' : ''} ${machine.focus === workload ? 'is-focused' : ''}`}
                    key={workload}
                    title={value === null ? `Not assigned to ${machine.id}` : `${machine.id} ${workload} availability`}
                  >
                    <span className="matrix-value">{displayPercent(value)}</span>
                    <span className="matrix-label">{workload === 'inference' ? 'Inference' : 'Non-inference'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div className="matrix-footer">
          us-central-1/2: server workloads · us-central-3: local-model inference · telemetry pending
        </div>
      </div>
    </div>
  );
}
