// Definiere die verfügbaren Themen
export type ThemeColor = 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'pink' | 'indigo' | 'teal' | 'orange' | 'gray';

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
    name: 'Red',
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
    name: 'Green',
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
    name: 'Blue',
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
    name: 'Purple',
    color: 'purple',
    bgColor: '#581c87',
    lightBgColor: '#6b21a8',
    darkBgColor: '#3b0764',
    accentColor: '#a855f7',
    textColor: '#e9d5ff',
    darkTextColor: '#f3e8ff',
  },
  {
    id: 4,
    name: 'Yellow',
    color: 'yellow',
    bgColor: '#854d0e',
    lightBgColor: '#b45309',
    darkBgColor: '#713f12',
    accentColor: '#eab308',
    textColor: '#fef9c3',
    darkTextColor: '#fef3c7',
  },
  {
    id: 5,
    name: 'Pink',
    color: 'pink',
    bgColor: '#831843',
    lightBgColor: '#9d174d',
    darkBgColor: '#500724',
    accentColor: '#ec4899',
    textColor: '#fbcfe8',
    darkTextColor: '#fce7f3',
  },
  {
    id: 6,
    name: 'Indigo',
    color: 'indigo',
    bgColor: '#3730a3',
    lightBgColor: '#4338ca',
    darkBgColor: '#312e81',
    accentColor: '#6366f1',
    textColor: '#e0e7ff',
    darkTextColor: '#eef2ff',
  },
  {
    id: 7,
    name: 'Teal',
    color: 'teal',
    bgColor: '#0f766e',
    lightBgColor: '#0d9488',
    darkBgColor: '#115e59',
    accentColor: '#14b8a6',
    textColor: '#ccfbf1',
    darkTextColor: '#f0fdfa',
  },
  {
    id: 8,
    name: 'Orange',
    color: 'orange',
    bgColor: '#9a3412',
    lightBgColor: '#c2410c',
    darkBgColor: '#7c2d12',
    accentColor: '#f97316',
    textColor: '#ffedd5',
    darkTextColor: '#fff7ed',
  },
  {
    id: 9,
    name: 'Gray',
    color: 'gray',
    bgColor: '#374151',
    lightBgColor: '#4b5563',
    darkBgColor: '#1f2937',
    accentColor: '#6b7280',
    textColor: '#f3f4f6',
    darkTextColor: '#f9fafb',
  },
];

let activeTheme: Theme = themes[0];

// Convert a color name or hex value to a ThemeColor
export const getThemeColorFromValue = (color: string): ThemeColor => {
  // Default to blue if color is undefined or empty
  if (!color || color.trim() === '') {
    return 'blue';
  }
  
  const colorValue = color.toLowerCase();
  
  // Check if it's a hex value
  if (colorValue.startsWith('#')) {
    // Red colors
    if (colorValue.includes('#7f1d1d') || colorValue.includes('#991b1b')) {
      return 'red';
    }
    // Green colors
    else if (colorValue.includes('#14532d') || colorValue.includes('#047857')) {
      return 'green';
    }
    // Blue colors
    else if (colorValue.includes('#1e3a8a') || colorValue.includes('#0369a1')) {
      return 'blue';
    }
    // Purple colors
    else if (colorValue.includes('#581c87') || colorValue.includes('#6b21a8')) {
      return 'purple';
    }
    // Yellow colors
    else if (colorValue.includes('#854d0e') || colorValue.includes('#b45309')) {
      return 'yellow';
    }
    // Pink colors
    else if (colorValue.includes('#831843') || colorValue.includes('#9d174d')) {
      return 'pink';
    }
    // Indigo colors
    else if (colorValue.includes('#3730a3')) {
      return 'indigo';
    }
    // Teal colors
    else if (colorValue.includes('#0f766e')) {
      return 'teal';
    }
    // Orange colors
    else if (colorValue.includes('#9a3412')) {
      return 'orange';
    }
    // Gray colors
    else if (colorValue.includes('#374151')) {
      return 'gray';
    }
    
    // Generic fallbacks based on hex code patterns
    if (colorValue.includes('f') && (colorValue.includes('0') || colorValue.includes('1') || colorValue.includes('2'))) {
      return 'red';
    } else if (colorValue.includes('0') && colorValue.includes('f') && colorValue.includes('0')) {
      return 'green';
    } else if (colorValue.includes('0') && colorValue.includes('0') && colorValue.includes('f')) {
      return 'blue';
    } else if (colorValue.includes('a') || colorValue.includes('9') || colorValue.includes('8')) {
      return 'purple';
    }
    return 'blue';
  }
  
  // Check named colors
  if (colorValue === 'red') return 'red';
  if (colorValue === 'green') return 'green';
  if (colorValue === 'blue') return 'blue';
  if (colorValue === 'purple') return 'purple';
  if (colorValue === 'yellow') return 'yellow';
  if (colorValue === 'pink') return 'pink';
  if (colorValue === 'indigo') return 'indigo';
  if (colorValue === 'teal') return 'teal';
  if (colorValue === 'orange') return 'orange';
  if (colorValue === 'gray') return 'gray';
  
  // Default to blue for any other value
  return 'blue';
};

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

// Set theme by color name or value
export const setThemeByColor = (color: string): Theme => {
  const themeColor = getThemeColorFromValue(color);
  const theme = themes.find(t => t.color === themeColor) || themes[0];
  
  // Set as active theme
  return setTheme(theme.id);
};

export const getTheme = (): Theme => {
  return activeTheme;
}; 