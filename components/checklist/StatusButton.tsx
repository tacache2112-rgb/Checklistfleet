import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { ChecklistStatus } from '@/types/checklist';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface StatusButtonProps {
status: ChecklistStatus | null;
onPress: (status: ChecklistStatus) => void;
}

const getStatusColor = (
status: ChecklistStatus | null,
selectedStatus: ChecklistStatus,
isDark: boolean,
) => {
if (status === selectedStatus) {
switch (selectedStatus) {
case 'ok':
return '#10b981';
case 'regular':
return '#f59e0b';
case 'ruim':
return '#ef4444';
}
}
return isDark ? '#334155' : '#e5e7eb';
};

const getStatusLabel = (status: ChecklistStatus): string => {
switch (status) {
case 'ok':
return 'OK';
case 'regular':
return 'Regular';
case 'ruim':
return 'Ruim';
}
};

export const StatusButton = ({ status, onPress }: StatusButtonProps) => {
const { theme } = useTheme();
const colors = Colors[theme];
const isDark = theme === 'dark';

return (
<View style={styles.container}>
{(['ok', 'regular', 'ruim'] as ChecklistStatus[]).map((s) => (
<TouchableOpacity
key={s}
style={[
styles.button,
{
borderColor: getStatusColor(status, s, isDark),
backgroundColor: colors.surface,
},
status === s && styles.buttonActive,
]}
onPress={() => onPress(s)}
>
<Text
style={[
styles.label,
{ color: colors.text },
status === s && styles.labelActive,
]}
>
{getStatusLabel(s)}
</Text>
</TouchableOpacity>
))}
</View>
);
};

const styles = StyleSheet.create({
container: {
flexDirection: 'row',
gap: 8,
justifyContent: 'space-between',
},
button: {
flex: 1,
paddingVertical: 8,
paddingHorizontal: 10,
borderWidth: 2,
borderRadius: 6,
alignItems: 'center',
},
buttonActive: {
opacity: 0.8,
},
label: {
fontSize: 12,
fontWeight: '600',
},
labelActive: {
fontWeight: '700',
},
});
