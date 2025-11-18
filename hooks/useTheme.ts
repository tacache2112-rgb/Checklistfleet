import { ThemeContext } from '@/context/ThemeContext';
import { useContext } from 'react';

export interface ThemeContextProps {
    background: string;
    text: string;
    tint: string;

    primary: string;
    inputBackground: string;
    border: string;
    placeholderText: string;
    buttonText: string;

    theme: 'light' | 'dark';
    colorScheme?: 'light' | 'dark' | null;

    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export interface UseThemeReturn
    extends Omit<ThemeContextProps, 'toggleTheme' | 'setTheme' | 'theme'> {
    isDark: boolean;

    theme: 'light' | 'dark';
}

export const useTheme = (): UseThemeReturn => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    }

    const themeContext = context as ThemeContextProps;

    return {
        ...themeContext,

        isDark: themeContext.theme === 'dark',
    } as UseThemeReturn;
};
