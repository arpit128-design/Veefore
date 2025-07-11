import { createContext, useContext, useEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = 'light';

  useEffect(() => {
    // Force light theme only - Complete cleanup
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
    
    // Remove any dark mode classes from body
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    
    // Force light theme in localStorage
    localStorage.setItem('theme', 'light');
    localStorage.removeItem('darkMode');
    
    // Force CSS variables to light theme
    root.style.setProperty('--background', '255 255 255');
    root.style.setProperty('--foreground', '15 23 42');
    root.style.setProperty('--card', '255 255 255');
    root.style.setProperty('--card-foreground', '15 23 42');
    root.style.setProperty('--popover', '255 255 255');
    root.style.setProperty('--popover-foreground', '15 23 42');
    root.style.setProperty('--primary', '37 99 235');
    root.style.setProperty('--primary-foreground', '255 255 255');
    root.style.setProperty('--secondary', '248 250 252');
    root.style.setProperty('--secondary-foreground', '15 23 42');
    root.style.setProperty('--muted', '241 245 249');
    root.style.setProperty('--muted-foreground', '100 116 139');
    root.style.setProperty('--accent', '241 245 249');
    root.style.setProperty('--accent-foreground', '15 23 42');
    root.style.setProperty('--border', '226 232 240');
    root.style.setProperty('--input', '255 255 255');
    root.style.setProperty('--ring', '37 99 235');
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Always keep light theme
    console.log('Theme change attempted, maintaining light theme');
  };

  const toggleTheme = () => {
    // Always keep light theme
    console.log('Theme toggle attempted, maintaining light theme');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}