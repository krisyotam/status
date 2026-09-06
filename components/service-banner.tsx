import { StatusMark } from '@/components/status-mark';
import type { StatusService } from '@/lib/gatus';

const copy = {
  available: {
    title: 'Service fully operational',
    detail: (name: string) => `We are not aware of any issues impacting ${name}.`,
  },
  degraded: {
    title: 'Service experiencing disruption',
    detail: (name: string) => `Monitoring has detected intermittent issues impacting ${name}.`,
  },
  unavailable: {
    title: 'Service outage detected',
    detail: (name: string) => `Monitoring currently reports that ${name} is unavailable.`,
  },
  unknown: {
    title: 'Service status unavailable',
    detail: (name: string) => `Current monitoring data for ${name} could not be retrieved.`,
  },
} as const;

export function ServiceBanner({ service }: { service: StatusService }) {
  const message = copy[service.level];
  return (
    <section className="system-banner service-banner" aria-live="polite">
      <StatusMark level={service.level} size="large" />
      <div>
        <h2>{message.title}</h2>
        <p>{message.detail(service.name)}</p>
      </div>
    </section>
  );
}
