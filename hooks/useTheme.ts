import { ThemeContext, ThemeType } from '@/context/ThemeContext';
import { useContext } from 'react';

interface UseThemeReturn {
theme: ThemeType;
isDark: boolean;
toggleTheme: () => void;
setTheme: (theme: ThemeType) => void;
}

export const useTheme = (): UseThemeReturn => {
const context = useContext(ThemeContext);

if (context === undefined) {
throw new Error('useTheme deve ser usado dentro de ThemeProvider');
}

return {
...context,
isDark: context.theme === 'dark',
};
};
