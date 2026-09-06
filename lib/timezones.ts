export const TIMEZONE_OPTIONS = [
  { id: 'CST', timeZone: 'Etc/GMT+6', offset: 'UTC−06:00' },
  { id: 'EST', timeZone: 'Etc/GMT+5', offset: 'UTC−05:00' },
  { id: 'MST', timeZone: 'Etc/GMT+7', offset: 'UTC−07:00' },
  { id: 'PST', timeZone: 'Etc/GMT+8', offset: 'UTC−08:00' },
  { id: 'UTC', timeZone: 'UTC', offset: 'UTC±00:00' },
  { id: 'GMT', timeZone: 'Etc/GMT', offset: 'UTC±00:00' },
  { id: 'CET', timeZone: 'Etc/GMT-1', offset: 'UTC+01:00' },
  { id: 'IST', timeZone: 'Asia/Kolkata', offset: 'UTC+05:30' },
  { id: 'JST', timeZone: 'Asia/Tokyo', offset: 'UTC+09:00' },
  { id: 'AEST', timeZone: 'Etc/GMT-10', offset: 'UTC+10:00' },
] as const;

export type TimezoneId = (typeof TIMEZONE_OPTIONS)[number]['id'];

export const DEFAULT_TIMEZONE_ID: TimezoneId = 'CST';

export function getTimezone(id: string) {
  return TIMEZONE_OPTIONS.find((option) => option.id === id) ?? TIMEZONE_OPTIONS[0];
}

export function isTimezoneId(value: string): value is TimezoneId {
  return TIMEZONE_OPTIONS.some((option) => option.id === value);
}
