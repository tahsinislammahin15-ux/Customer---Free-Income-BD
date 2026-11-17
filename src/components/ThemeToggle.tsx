import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  variant?: 'navbar' | 'surface';
  compact?: boolean;
  className?: string;
}

const MODES: { id: ThemeMode; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'system', label: 'System', Icon: Monitor },
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'surface',
  compact = false,
  className = '',
}) => {
  const { theme, themePreference, setTheme } = useApp();

  const cycleTheme = () => {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(themePreference);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  };

  if (compact) {
    const CurrentIcon =
      themePreference === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;
    return (
      <button
        type="button"
        onClick={cycleTheme}
        aria-label={`Theme: ${themePreference}. Click to switch theme.`}
        title={`Theme: ${themePreference} (resolved: ${theme})`}
        className={
          variant === 'navbar'
            ? `h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#3D1414] hover:bg-[#4E1A1A] border border-[#5C2222] text-white flex items-center justify-center shrink-0 transition-colors ${className}`
            : `h-9 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 flex items-center gap-1.5 text-xs font-bold shrink-0 transition-colors ${className}`
        }
      >
        <CurrentIcon className="w-4 h-4 text-[#FFB800] dark:text-[#FF7A00]" />
      </button>
    );
  }

  if (variant === 'navbar') {
    return (
      <div
        role="group"
        aria-label="Theme mode"
        className={`h-8 sm:h-9 p-0.5 rounded-lg bg-[#3D1414] border border-[#5C2222] flex items-center gap-0.5 shrink-0 ${className}`}
      >
        {MODES.map(({ id, label, Icon }) => {
          const active = themePreference === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              aria-pressed={active}
              aria-label={`${label} theme`}
              title={`${label} theme`}
              className={`h-7 px-2 rounded-md text-[11px] font-bold flex items-center justify-center transition-colors ${
                active
                  ? 'bg-white text-[#1A0505] shadow-xs'
                  : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className={`p-1 rounded-xl bg-gray-100 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-700 inline-flex items-center gap-1 ${className}`}
    >
      {MODES.map(({ id, label, Icon }) => {
        const active = themePreference === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            aria-pressed={active}
            aria-label={`${label} theme`}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              active
                ? 'bg-[#3B0A0A] dark:bg-[#FF5500] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
