'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Clock3 } from 'lucide-react';
import { useTimezone } from '@/components/timezone-provider';
import { TIMEZONE_OPTIONS, type TimezoneId } from '@/lib/timezones';

export function TimezoneSelect() {
  const { id, setTimezone } = useTimezone();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    containerRef.current
      ?.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]')
      ?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function selectTimezone(nextId: TimezoneId) {
    setTimezone(nextId);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const options = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    );
    const index = options.indexOf(event.currentTarget);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      options[(index + 1) % options.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      options[(index - 1 + options.length) % options.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      options[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      options.at(-1)?.focus();
    }
  }

  return (
    <div className="timezone-control" ref={containerRef}>
      <button
        className="utility-pill timezone-trigger"
        type="button"
        aria-label="Display timezone"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
      >
        <Clock3 aria-hidden="true" size={14} strokeWidth={1.8} />
        <span>Time:</span>
        <strong>{id}</strong>
        <ChevronDown className="timezone-chevron" aria-hidden="true" size={13} strokeWidth={2} />
      </button>
      {open && (
        <div className="timezone-menu" id={menuId} role="listbox" aria-label="Timezones">
          <div className="timezone-menu-label">Display timezone</div>
          {TIMEZONE_OPTIONS.map((option) => (
            <button
              className="timezone-option"
              type="button"
              role="option"
              aria-selected={option.id === id}
              onClick={() => selectTimezone(option.id)}
              onKeyDown={handleOptionKeyDown}
              key={option.id}
            >
              <span>{option.id}</span>
              <span className="timezone-option-meta">{option.offset}</span>
              {option.id === id && <Check aria-hidden="true" size={14} strokeWidth={2.4} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
