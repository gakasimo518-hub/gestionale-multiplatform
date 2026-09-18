import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ThemeContext provides:
 * - current theme ('light' | 'dark')
 * - toggleTheme() to switch themes
 * - current user role ('admin' | 'employee' | 'client' | 'guest')
 * - setRole() to change role
 */
const ThemeContext = createContext();

/**
 * ThemeProvider wraps the app and manages theme & role state.
 * Theme preference is persisted in localStorage and reflected on the <html> element
 * via a data-theme attribute for Tailwind dark mode support.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [role, setRole] = useState('guest');

  // Initialize theme and role from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedRole = localStorage.getItem('role');

    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Persist theme changes and update <html> attribute for Tailwind dark mode
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist role changes
  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const value = { theme, toggleTheme, role, setRole };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to consume ThemeContext.
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Role-based styling helper.
 * Returns a string of Tailwind utility classes that can be spread into a component.
 * Adjust the classes to match your design system.
 */
export const useRoleStyles = () => {
  const { role } = useTheme();

  const roleClasses = {
    admin: 'bg-red-600 text-white hover:bg-red-700',
    employee: 'bg-blue-600 text-white hover:bg-blue-700',
    client: 'bg-green-600 text-white hover:bg-green-700',
    guest: 'bg-gray-600 text-white hover:bg-gray-700',
  };

  return roleClasses[role] ?? roleClasses.guest;
};