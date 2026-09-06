const clusterRows = [
  { source: 'eu-west-1', endpoints: [[100, 100], [99.93, 100], [99.74, 100]] },
  { source: 'us-east-1', endpoints: [[100, 100], [100, 100], [99.91, 100]] },
  { source: 'us-west-2', endpoints: [[100, 100], [99.78, 100], [100, 100]] },
] as const;

const clusterEndpoints = [
  'eu-west-1.stargate',
  'us-east-1.stargate',
  'us-west-2.stargate',
];

function displayPercent(value: number) {
  return value === 100 ? '100%' : `${value.toFixed(2)}%`;
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
          {clusterEndpoints.map((endpoint) => <span key={endpoint}>{endpoint}</span>)}
        </div>
        {clusterRows.map((row) => (
          <div className="matrix-row" key={row.source}>
            <span className="matrix-source">{row.source}</span>
            {row.endpoints.map((pair, endpointIndex) => (
              <div className="matrix-cell" key={`${row.source}-${clusterEndpoints[endpointIndex]}`}>
                {pair.map((value, metricIndex) => (
                  <div
                    className={`matrix-metric ${value < 100 ? 'is-degraded' : ''}`}
                    key={metricIndex === 0 ? 'inference' : 'non-inference'}
                  >
                    <span className="matrix-value">{displayPercent(value)}</span>
                    <span className="matrix-label">{metricIndex === 0 ? 'Inference' : 'Non-inference'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div className="matrix-footer">Stargate cluster sample data · live integration pending</div>
      </div>
    </div>
  );
}
