'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import {
  DEFAULT_TIMEZONE_ID,
  getTimezone,
  isTimezoneId,
  type TimezoneId,
} from '@/lib/timezones';

const STORAGE_KEY = 'status-timezone';
const CHANGE_EVENT = 'status-timezone-change';

type TimezoneContextValue = {
  id: TimezoneId;
  timeZone: string;
  setTimezone: (id: TimezoneId) => void;
};

const TimezoneContext = createContext<TimezoneContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): TimezoneId {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && isTimezoneId(stored) ? stored : DEFAULT_TIMEZONE_ID;
}

function getServerSnapshot(): TimezoneId {
  return DEFAULT_TIMEZONE_ID;
}

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const id = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const option = getTimezone(id);

  function setTimezone(nextId: TimezoneId) {
    window.localStorage.setItem(STORAGE_KEY, nextId);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <TimezoneContext.Provider value={{ id, timeZone: option.timeZone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const context = useContext(TimezoneContext);
  if (!context) throw new Error('useTimezone must be used within TimezoneProvider');
  return context;
}
