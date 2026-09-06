'use client';

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
      <span className="theme-sun" aria-hidden="true">☼</span>
      <span className="theme-moon" aria-hidden="true">☾</span>
    </button>
  );
}
