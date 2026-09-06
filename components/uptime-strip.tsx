import type { UptimeDay } from '@/lib/gatus';

export function UptimeStrip({ days }: { days: UptimeDay[] }) {
  return (
    <div className="uptime-strip" aria-label="Daily availability for the last 30 days">
      {days.map((day) => (
        <span
          className={`uptime-day is-${day.level}`}
          key={day.date}
          title={`${day.date}: ${day.level === 'available' ? 'Available' : 'Outage recorded'}`}
        />
      ))}
    </div>
  );
}
