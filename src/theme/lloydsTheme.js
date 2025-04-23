/**
 * Lloyds Constellation Theme
 * This theme file provides consistent styling across the app based on 
 * Lloyds Banking Group's Constellation design system.
 */

export const colors = {
  // Primary colors
  primaryDarkGreen: '#006A4D', // Lloyds primary green
  primaryLightGreen: '#24AE91',
  white: '#FFFFFF',
  black: '#000000',
  
  // Secondary colors
  deepBlue: '#004D6E',
  mediumBlue: '#0077B3',
  lightBlue: '#BDE5F8',
  
  // Accent colors
  accentYellow: '#FFB600',
  accentAmber: '#FF9E1B',
  
  // Neutrals
  grey100: '#F5F7FA', // Lightest
  grey200: '#EDF0F5',
  grey300: '#DDE2EB',
  grey400: '#BCC5D3',
  grey500: '#98A4B5',
  grey600: '#6C7C95',
  grey700: '#4A5568', // Darkest
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Background
  background: '#F9FAFC',
  cardBackground: '#FFFFFF',
};

export const typography = {
  fontFamily: {
    regular: 'Lloyds Bank Text Regular, Helvetica, Arial, sans-serif',
    medium: 'Lloyds Bank Text Medium, Helvetica, Arial, sans-serif',
    bold: 'Lloyds Bank Text Bold, Helvetica, Arial, sans-serif',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borders = {
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  width: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
};

export const shadows = {
  light: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  strong: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Common component styles based on Lloyds Constellation design system
export const components = {
  button: {
    primary: {
      backgroundColor: colors.primaryDarkGreen,
      color: colors.white,
      borderRadius: borders.radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    secondary: {
      backgroundColor: colors.white,
      color: colors.primaryDarkGreen,
      borderColor: colors.primaryDarkGreen,
      borderWidth: borders.width.normal,
      borderRadius: borders.radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: colors.primaryDarkGreen,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  },
  card: {
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: borders.radius.lg,
      padding: spacing.lg,
      ...shadows.light,
    },
  },
  input: {
    container: {
      borderWidth: borders.width.thin,
      borderColor: colors.grey400,
      borderRadius: borders.radius.md,
      padding: spacing.md,
      backgroundColor: colors.white,
    },
    focus: {
      borderColor: colors.primaryDarkGreen,
    },
    error: {
      borderColor: colors.error,
    },
    label: {
      color: colors.grey700,
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.xs,
    },
  },
};

export default {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  components,
};
