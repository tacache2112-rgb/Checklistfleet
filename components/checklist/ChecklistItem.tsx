import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import {
ChecklistItem as ChecklistItemType,
ChecklistStatus,
} from '@/types/checklist';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusButton } from './StatusButton';

export interface ChecklistItemProps {
item: ChecklistItemType;
onStatusChange: (status: ChecklistStatus) => void;
onNotesChange: (notes: string) => void;
}

export const ChecklistItem = ({
item,
onStatusChange,
onNotesChange,
}: ChecklistItemProps) => {
const { theme } = useTheme();
const colors = Colors[theme];

return (
<View
style={[
styles.container,
{ backgroundColor: colors.surface, borderColor: colors.border },
]}
>
<Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
<StatusButton status={item.status} onPress={onStatusChange} />
<TextInput
style={[
styles.notesInput,
{
borderColor: colors.border,
color: colors.text,
backgroundColor: colors.background,
},
]}
placeholder="Observações..."
placeholderTextColor={colors.placeholder}
value={item.notes}
onChangeText={onNotesChange}
multiline
numberOfLines={2}
/>
</View>
);
};

const styles = StyleSheet.create({
container: {
paddingVertical: 12,
paddingHorizontal: 12,
marginBottom: 12,
borderRadius: 8,
borderWidth: 1,
},
itemName: {
fontSize: 13,
fontWeight: '600',
marginBottom: 10,
},
notesInput: {
marginTop: 8,
paddingHorizontal: 10,
paddingVertical: 8,
borderWidth: 1,
borderRadius: 6,
fontSize: 12,
minHeight: 60,
textAlignVertical: 'top',
},
});
