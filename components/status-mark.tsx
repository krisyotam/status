import type { IncidentType, ServiceLevel } from '@/lib/gatus';

export function StatusMark({
  level,
  size = 'normal',
}: {
  level: IncidentType | ServiceLevel;
  size?: 'normal' | 'large';
}) {
  return (
    <span
      className={`status-mark is-${level} ${size === 'large' ? 'is-large' : ''}`}
      aria-hidden="true"
    />
  );
}
