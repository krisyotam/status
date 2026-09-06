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

This repository contains only the Next.js interface. Gatus is not vendored here;
run it independently from the current upstream image or release, then provide its
base URL through `GATUS_URL`.

```bash
docker pull twinproduction/gatus:latest
docker build -t status-ui .
docker run --rm -p 8092:8092 \
  -e PORT=8092 \
  -e GATUS_URL=http://host.docker.internal:8091 \
  status-ui
```

Point the `status.krisyotam.com` reverse proxy at the Next.js UI on port 8092.
The preserved Gatus fork and deployment configuration live separately at
[`krisyotam/gatus`](https://github.com/krisyotam/gatus), tracking
[`TwiN/gatus`](https://github.com/TwiN/gatus) as upstream.

The live-service matrix currently models three Stargate machines: `us-central-1`
and `us-central-2` are non-inference servers, while `us-central-3` is dedicated
to local-model inference. The topology lives in `lib/stargate.ts`, keeping the
placeholder telemetry separate so a live adapter can replace it without changing
the board UI.
