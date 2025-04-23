import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import lloydsTheme from '../theme';

/**
 * ThemeContext for providing theme values across the app
 * Following Geri Reid's design system principles of maintaining
 * a consistent source of truth for design tokens
 */
export const ThemeContext = createContext({
  theme: lloydsTheme,
  isDarkMode: false,
  toggleDarkMode: () => {},
});

/**
 * Custom hook to use theme values within components
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * ThemeProvider component that provides Lloyds theme context to the app
 * This sets up base styling like StatusBar color and provides
 * theme context for consistent styling across the application
 * 
 * Based on the Constellation design system approach from Geri Reid's
 * design system documentation
 */
const ThemeProvider = ({ children }) => {
  // Get system color scheme
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  
  // Listen for system changes to color scheme
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  // Function to allow manual toggle of dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Create the theme context value
  const themeContextValue = {
    theme: lloydsTheme, // For now using lloyds theme, could be extended with dark mode
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <StatusBar
        backgroundColor={lloydsTheme.colors.primaryDarkGreen}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
