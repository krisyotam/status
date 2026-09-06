import { Check } from 'lucide-react';
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
    >
      <Check size={size === 'large' ? 18 : 13} strokeWidth={2.5} />
    </span>
  );
}
