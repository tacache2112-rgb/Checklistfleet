import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Colors } from '@/constants/theme';
import { useChecklistStorage } from '@/hooks/useChecklistStorage';
import { useTheme } from '@/hooks/useTheme';
import { VehicleChecklist } from '@/types/checklist';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
ActivityIndicator,
Alert,
FlatList,
StyleSheet,
Text,
TouchableOpacity,
View,
} from 'react-native';

export interface ChecklistListProps {
onSelectChecklist?: (id: string) => void;
onCreateNew?: () => void;
}

const ChecklistListItem = ({
checklist,
onPress,
onDelete,
colors,
}: {
checklist: VehicleChecklist;
onPress: () => void;
onDelete: () => void;
colors: typeof Colors.light;
}) => {
const date = new Date(checklist.createdAt).toLocaleDateString('pt-BR');

return (
<TouchableOpacity
style={[
styles.item,
{ backgroundColor: colors.surface, borderColor: colors.border },
]}
onPress={onPress}
>
<View style={styles.itemContent}>
<Text style={[styles.itemTitle, { color: colors.text }]}>
{checklist.plate}
</Text>
<Text style={[styles.itemSubtitle, { color: colors.placeholder }]}>
Motorista: {checklist.driver}
</Text>
<Text style={[styles.itemDate, { color: colors.placeholder }]}>{date}</Text>
</View>
<TouchableOpacity
style={styles.deleteButton}
onPress={(e) => {
e.stopPropagation();
onDelete();
}}
>
<Text style={styles.deleteButtonText}>Excluir</Text>
</TouchableOpacity>
</TouchableOpacity>
);
};

export const ChecklistList = ({
onSelectChecklist,
onCreateNew,
}: ChecklistListProps) => {
const { theme } = useTheme();
const colors = Colors[theme];
const { getAllChecklists, deleteChecklist } = useChecklistStorage();
const [checklists, setChecklists] = useState<VehicleChecklist[]>([]);
const [loading, setLoading] = useState(true);

useFocusEffect(
useCallback(() => {
loadChecklists();
}, []),
);

const loadChecklists = async () => {
try {
setLoading(true);
const data = await getAllChecklists();
setChecklists(
data.sort(
(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
),
);
} catch (error) {
console.error('Error loading checklists:', error);
Alert.alert('Erro', 'Não foi possível carregar os checklists');
} finally {
setLoading(false);
}
};

const handleDelete = (id: string, plate: string) => {
Alert.alert(
'Confirmar exclusão',
`Tem certeza que deseja excluir o checklist da placa ${plate}?`,
[
{
text: 'Cancelar',
style: 'cancel',
},
{
text: 'Excluir',
style: 'destructive',
onPress: async () => {
try {
await deleteChecklist(id);
await loadChecklists();
Alert.alert('Sucesso', 'Checklist excluído com sucesso');
} catch (error) {
Alert.alert('Erro', 'Não foi possível excluir o checklist');
}
},
},
],
);
};

if (loading) {
return (
<View style={[styles.container, { backgroundColor: colors.background }]}>
<ActivityIndicator size="large" color={colors.text} />
</View>
);
}

return (
<View style={[styles.container, { backgroundColor: colors.background }]}>
<View
style={[
styles.header,
{ backgroundColor: colors.surface, borderBottomColor: colors.border },
]}
>
<View style={styles.headerLeft}>
<Text style={[styles.headerTitle, { color: colors.text }]}>
Meus Checklists
</Text>
</View>
<View style={styles.headerRight}>
<ThemeToggle />
<TouchableOpacity style={styles.createButton} onPress={onCreateNew}>
<Text style={styles.createButtonText}>+ Novo</Text>
</TouchableOpacity>
</View>
</View>

{checklists.length === 0 ? (
<View style={styles.emptyContainer}>
<Text style={[styles.emptyText, { color: colors.placeholder }]}>
Nenhum checklist criado ainda
</Text>
<TouchableOpacity style={styles.emptyButton} onPress={onCreateNew}>
<Text style={styles.emptyButtonText}>Criar Primeiro Checklist</Text>
</TouchableOpacity>
</View>
) : (
<FlatList
data={checklists}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<ChecklistListItem
checklist={item}
onPress={() => onSelectChecklist?.(item.id)}
colors={colors}
onDelete={() => handleDelete(item.id, item.plate)}
/>
)}
contentContainerStyle={styles.listContent}
scrollEnabled={false}
/>
)}
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: 16,
paddingVertical: 16,
borderBottomWidth: 1,
},
headerLeft: {
flex: 1,
},
headerRight: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
},
headerTitle: {
fontSize: 18,
fontWeight: '700',
},
createButton: {
paddingHorizontal: 12,
paddingVertical: 8,
backgroundColor: '#0ea5e9',
borderRadius: 6,
},
createButtonText: {
color: '#fff',
fontWeight: '600',
fontSize: 12,
},
listContent: {
padding: 12,
},
item: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: 12,
paddingVertical: 12,
marginBottom: 12,
borderRadius: 8,
borderWidth: 1,
},
itemContent: {
flex: 1,
},
itemTitle: {
fontSize: 14,
fontWeight: '700',
marginBottom: 4,
},
itemSubtitle: {
fontSize: 12,
marginBottom: 2,
},
itemDate: {
fontSize: 11,
},
deleteButton: {
paddingHorizontal: 10,
paddingVertical: 6,
backgroundColor: '#fecaca',
borderRadius: 4,
marginLeft: 8,
},
deleteButtonText: {
fontSize: 11,
fontWeight: '600',
color: '#dc2626',
},
emptyContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
paddingHorizontal: 32,
},
emptyText: {
fontSize: 14,
textAlign: 'center',
marginBottom: 16,
},
emptyButton: {
paddingHorizontal: 20,
paddingVertical: 12,
backgroundColor: '#0ea5e9',
borderRadius: 8,
},
emptyButtonText: {
color: '#fff',
fontWeight: '600',
fontSize: 14,
},
});
