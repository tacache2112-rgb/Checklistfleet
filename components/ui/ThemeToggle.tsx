import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const ThemeToggle = () => {
const { theme, toggleTheme } = useTheme();
const colors = Colors[theme];

return (
<TouchableOpacity
style={[
styles.container,
{ backgroundColor: colors.surface, borderColor: colors.border },
]}
onPress={toggleTheme}
>
<Text style={styles.icon}>{theme === 'dark' ? '☀️' : '🌙'}</Text>
<Text style={[styles.label, { color: colors.text }]}>
{theme === 'dark' ? 'Light' : 'Dark'}
</Text>
</TouchableOpacity>
);
};

const styles = StyleSheet.create({
container: {
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 12,
paddingVertical: 8,
borderRadius: 8,
borderWidth: 1,
gap: 6,
},
icon: {
fontSize: 16,
},
label: {
fontSize: 12,
fontWeight: '600',
},
});
