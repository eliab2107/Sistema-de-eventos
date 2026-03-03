// Paleta de cores e constantes de tema
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    accent: {
      orange: {
        100: '#fed7aa',
        600: '#ea580c',
      },
      green: {
        100: '#dcfce7',
        700: '#15803d',
      },
      purple: {
        100: '#f3e8ff',
        600: '#a855f7',
      },
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    bg: {
      light: '#f3f4f6', // fundo claro
      white: '#ffffff',
    },
    border: '#e5e7eb', // cinza 200
    text: {
      primary: '#111827', // cinza 900
      secondary: '#6b7280', // cinza 500
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export default theme;
