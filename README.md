# Status UI

Custom Next.js interface for `status.krisyotam.com`. Gatus remains the monitoring
engine and source of truth; the UI reads its public v1 endpoints for current
health, 30-day uptime, and incident history.

## Local development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000` and defaults to the public Gatus API.
Set `GATUS_URL=http://127.0.0.1:8091` to use a local Gatus process.

## Verification

```bash
npm test
npm run lint
npm run build
```

## Production

The root `docker-compose.yml` runs Gatus on port 8091 and the standalone Next.js
UI on port 8092. Point the `status.krisyotam.com` reverse proxy at port 8092 when
the custom frontend is ready to replace the built-in Gatus UI.

The live-service matrix currently contains representative Stargate sample data.
Its adapter is intentionally isolated in `components/cluster-matrix.tsx` so real
cluster telemetry can replace it without changing the rest of the status board.
