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
    // COMPLETE LIGHT THEME SETUP - No dark mode conversion
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all dark mode classes and references
    root.classList.remove('dark', 'dark-mode');
    body.classList.remove('dark', 'dark-mode');
    
    // Force light theme classes
    root.classList.add('light');
    body.classList.add('light');
    
    // Set color scheme
    root.style.colorScheme = 'light';
    body.style.colorScheme = 'light';
    
    // Clean localStorage
    localStorage.setItem('theme', 'light');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('vueuse-color-scheme');
    
    // Force all CSS variables to light theme values
    // These match the :root values in index.css
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
    root.style.setProperty('--destructive', '239 68 68');
    root.style.setProperty('--destructive-foreground', '255 255 255');
    root.style.setProperty('--border', '226 232 240');
    root.style.setProperty('--input', '255 255 255');
    root.style.setProperty('--ring', '37 99 235');
    
    // Sidebar theme
    root.style.setProperty('--sidebar-background', '255 255 255');
    root.style.setProperty('--sidebar-foreground', '15 23 42');
    root.style.setProperty('--sidebar-primary', '37 99 235');
    root.style.setProperty('--sidebar-primary-foreground', '255 255 255');
    root.style.setProperty('--sidebar-accent', '241 245 249');
    root.style.setProperty('--sidebar-accent-foreground', '15 23 42');
    root.style.setProperty('--sidebar-border', '226 232 240');
    root.style.setProperty('--sidebar-ring', '37 99 235');
    
    // Ensure body background is pure white
    body.style.backgroundColor = 'rgb(255, 255, 255)';
    body.style.color = 'rgb(15, 23, 42)';
    
    // Force meta theme color for mobile browsers
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', '#ffffff');
    
    // Clean up any existing theme switches or mode detectors
    root.removeAttribute('data-theme');
    body.removeAttribute('data-theme');
    
    console.log('Pure light theme initialized - no dark mode conversion');
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Always maintain light theme
    console.log('Theme change blocked - maintaining pure light theme');
  };

  const toggleTheme = () => {
    // Always maintain light theme  
    console.log('Theme toggle blocked - maintaining pure light theme');
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