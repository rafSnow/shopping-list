/**
 * Paleta de cores moderna inspirada em design system
 * Esquema de cores escuro e vibrante
 */

export const colors = {
  // Cores primárias modernas
  primary: '#667EEA',
  primaryDark: '#4C63D2',
  secondary: '#764BA2',

  // Cores de status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Cores neutras modernas
  background: '#0F0F23',
  surface: '#1A1A2E',
  surfaceLight: '#16213E',
  cardBackground: '#1E1E3F',

  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#B4B4C7',
  textMuted: '#8E8EA9',

  // Efeitos
  glowBlue: '#667EEA',
  glowGreen: '#10B981',
  glowRed: '#EF4444',
} as const;

export const gradients = {
  primary: ['#667EEA', '#764BA2'],
  success: ['#10B981', '#059669'],
  danger: ['#EF4444', '#DC2626'],
  warning: ['#F59E0B', '#D97706'],
} as const;

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
