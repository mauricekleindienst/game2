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

export const setTheme = (themeId: number): Theme => {
  const theme = themes.find(t => t.id === themeId) || themes[0];
  activeTheme = theme;
  
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