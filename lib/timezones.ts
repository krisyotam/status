export const TIMEZONE_OPTIONS = [
  { id: 'CST', timeZone: 'Etc/GMT+6' },
  { id: 'EST', timeZone: 'Etc/GMT+5' },
  { id: 'MST', timeZone: 'Etc/GMT+7' },
  { id: 'PST', timeZone: 'Etc/GMT+8' },
  { id: 'UTC', timeZone: 'UTC' },
  { id: 'GMT', timeZone: 'Etc/GMT' },
  { id: 'CET', timeZone: 'Etc/GMT-1' },
  { id: 'IST', timeZone: 'Asia/Kolkata' },
  { id: 'JST', timeZone: 'Asia/Tokyo' },
  { id: 'AEST', timeZone: 'Etc/GMT-10' },
] as const;

export type TimezoneId = (typeof TIMEZONE_OPTIONS)[number]['id'];

export const DEFAULT_TIMEZONE_ID: TimezoneId = 'CST';

export function getTimezone(id: string) {
  return TIMEZONE_OPTIONS.find((option) => option.id === id) ?? TIMEZONE_OPTIONS[0];
}

export function isTimezoneId(value: string): value is TimezoneId {
  return TIMEZONE_OPTIONS.some((option) => option.id === value);
}
