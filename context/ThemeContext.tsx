import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
    setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined,
);

const THEME_STORAGE_KEY = '@checklistfleet:theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const deviceColorScheme = useDeviceColorScheme();
    const [theme, setThemeState] = useState<ThemeType>('dark');
    const [isLoaded, setIsLoaded] = useState(false);

    // Carrega o tema salvo ou usa o do dispositivo
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme =
                    await AsyncStorage.getItem(THEME_STORAGE_KEY);

                if (savedTheme === 'light' || savedTheme === 'dark') {
                    setThemeState(savedTheme);
                } else if (
                    deviceColorScheme === 'dark' ||
                    deviceColorScheme === 'light'
                ) {
                    // Usa o tema do dispositivo se nenhum tema foi salvo
                    setThemeState(deviceColorScheme);
                }
            } catch (error) {
                console.error('Erro ao carregar tema:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadTheme();
    }, [deviceColorScheme]);

    const setTheme = async (newTheme: ThemeType) => {
        try {
            setThemeState(newTheme);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Erro ao salvar tema:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
