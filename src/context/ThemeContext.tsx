import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'cosmic-night' | 'crystalline-day';

interface ThemeContextType {
  theme: ThemeMode;
  isDay: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'mehermart_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'crystalline-day' || saved === 'cosmic-night') {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
    }
    return 'cosmic-night';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme to localStorage', e);
    }

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    if (theme === 'crystalline-day') {
      root.classList.add('theme-crystalline-day');
      root.classList.remove('theme-cosmic-night');
      body.classList.add('theme-crystalline-day');
      body.classList.remove('theme-cosmic-night');
    } else {
      root.classList.add('theme-cosmic-night');
      root.classList.remove('theme-crystalline-day');
      body.classList.add('theme-cosmic-night');
      body.classList.remove('theme-crystalline-day');
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'cosmic-night' ? 'crystalline-day' : 'cosmic-night'));
  };

  const isDay = theme === 'crystalline-day';

  return (
    <ThemeContext.Provider value={{ theme, isDay, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
