// Definiere die verfügbaren Themen
export type ThemeColor = 'red' | 'green' | 'blue' | 'purple';

export interface Theme {
  id: number;
  name: string;
  color: ThemeColor;
  bgColor: string;
  lightBgColor: string;
  darkBgColor: string;
  accentColor: string;
  textColor: string;
  darkTextColor: string;
}

export const themes: Theme[] = [
  {
    id: 0,
    name: 'Markus',
    color: 'red',
    bgColor: '#7f1d1d',
    lightBgColor: '#991b1b',
    darkBgColor: '#450a0a',
    accentColor: '#ef4444',
    textColor: '#fecaca',
    darkTextColor: '#fee2e2', 
  },
  {
    id: 1,
    name: 'Tobi',
    color: 'green',
    bgColor: '#14532d', 
    lightBgColor: '#166534', 
    darkBgColor: '#052e16',     
    accentColor: '#22c55e', 
    textColor: '#bbf7d0', 
    darkTextColor: '#dcfce7', 
  },
  {
    id: 2,
    name: 'Nudelmacher',
    color: 'blue',
    bgColor: '#1e3a8a', 
    lightBgColor: '#1e40af', 
    darkBgColor: '#172554', 
    accentColor: '#3b82f6', 
    textColor: '#bfdbfe', 
    darkTextColor: '#dbeafe', 
  },
  {
    id: 3,
    name: 'Ficker',
    color: 'purple',
    bgColor: '#581c87', 
    lightBgColor: '#6b21a8', 
    darkBgColor: '#3b0764', 
    accentColor: '#a855f7', 
    textColor: '#e9d5ff', 
    darkTextColor: '#f3e8ff', 
  },
];

let activeTheme: Theme = themes[0];

// Function to generate lighter/darker variations of a color
const adjustColor = (hex: string, factor: number): string => {
  // Remove the # if present
  hex = hex.replace('#', '');

  // Parse the hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust the RGB values (darken or lighten)
  r = Math.min(255, Math.max(0, Math.round(r * factor)));
  g = Math.min(255, Math.max(0, Math.round(g * factor)));
  b = Math.min(255, Math.max(0, Math.round(b * factor)));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper to create accent and text colors
const deriveColors = (baseColor: string, themeType: ThemeColor): { accent: string, text: string, darkText: string } => {
  switch (themeType) {
    case 'red':
      return { 
        accent: '#ef4444', 
        text: '#fecaca', 
        darkText: '#fee2e2'
      };
    case 'green':
      return { 
        accent: '#22c55e', 
        text: '#bbf7d0', 
        darkText: '#dcfce7'
      };
    case 'blue':
      return { 
        accent: '#3b82f6', 
        text: '#bfdbfe', 
        darkText: '#dbeafe'
      };
    case 'purple':
      return { 
        accent: '#a855f7', 
        text: '#e9d5ff', 
        darkText: '#f3e8ff'
      };
    default:
      return { 
        accent: '#ef4444', 
        text: '#fecaca', 
        darkText: '#fee2e2'
      };
  }
};

export const setTheme = (themeIdOrTheme: number | Theme): Theme => {
  let theme: Theme;
  
  if (typeof themeIdOrTheme === 'number') {
    // Find theme by ID
    theme = themes.find(t => t.id === themeIdOrTheme) || themes[0];
  } else {
    // Use the provided theme object directly
    theme = themeIdOrTheme;
    
    // If this is a custom theme with just a bgColor, we need to derive the other colors
    if (!theme.lightBgColor || !theme.darkBgColor) {
      const lighter = adjustColor(theme.bgColor, 1.2);
      const darker = adjustColor(theme.bgColor, 0.6);
      const derived = deriveColors(theme.bgColor, theme.color);
      
      theme = {
        ...theme,
        lightBgColor: lighter,
        darkBgColor: darker,
        accentColor: derived.accent,
        textColor: derived.text,
        darkTextColor: derived.darkText
      };
    }
  }
  
  activeTheme = theme;
  
  // Set CSS variables
  document.documentElement.style.setProperty('--theme-bg', theme.bgColor);
  document.documentElement.style.setProperty('--theme-light-bg', theme.lightBgColor);
  document.documentElement.style.setProperty('--theme-dark-bg', theme.darkBgColor);
  document.documentElement.style.setProperty('--theme-accent', theme.accentColor);
  document.documentElement.style.setProperty('--theme-text', theme.textColor);
  document.documentElement.style.setProperty('--theme-dark-text', theme.darkTextColor);
  
  return theme;
};

export const getTheme = (): Theme => {
  return activeTheme;
}; 