'use client';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('status-theme', next);
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <span className="theme-dark-action" aria-hidden="true"><Moon size={16} /></span>
      <span className="theme-light-action" aria-hidden="true"><Sun size={16} /></span>
    </button>
  );
}
