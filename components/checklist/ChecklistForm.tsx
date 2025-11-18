import { Colors } from '@/constants/theme';
import { useChecklistStorage } from '@/hooks/useChecklistStorage';
import { useTheme } from '@/hooks/useTheme';
import {
ChecklistStatus,
INITIAL_SECTIONS,
VehicleChecklist,
} from '@/types/checklist';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
Alert,
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
View,
} from 'react-native';
import { ChecklistSection } from './ChecklistSection';
import { TextInputField } from './TextInputField';

export interface ChecklistFormProps {
checklistId?: string;
onSave?: (checklist: VehicleChecklist) => void;
}

export const ChecklistForm = ({ checklistId, onSave }: ChecklistFormProps) => {
const { theme } = useTheme();
const colors = Colors[theme];
const { loadChecklist, saveChecklist } = useChecklistStorage();
const [checklist, setChecklist] = useState<VehicleChecklist>(() => ({
id: checklistId || Date.now().toString(),
plate: '',
km: '',
driver: '',
date: new Date().toISOString().split('T')[0],
time: new Date().toTimeString().slice(0, 5),
sections: INITIAL_SECTIONS.map((section) => ({
...section,
sectionNotes: '',
})),
generalNotes: '',
driverSignature: '',
inspectorSignature: '',
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
}));

useFocusEffect(
useCallback(() => {
if (checklistId) {
loadChecklist(checklistId).then((loaded) => {
if (loaded) {
setChecklist(loaded);
}
});
}
}, [checklistId, loadChecklist]),
);

const handleSave = async () => {
if (!checklist.plate.trim()) {
Alert.alert('Erro', 'Por favor, preencha a placa do veículo');
return;
}

if (!checklist.driver.trim()) {
Alert.alert('Erro', 'Por favor, preencha o nome do motorista');
return;
}

const updatedChecklist = {
...checklist,
updatedAt: new Date().toISOString(),
};

try {
await saveChecklist(updatedChecklist);
Alert.alert('Sucesso', 'Checklist salvo com sucesso!');
onSave?.(updatedChecklist);
} catch (error) {
Alert.alert('Erro', 'Não foi possível salvar o checklist');
}
};

const updateSection = (sectionId: string, updates: any) => {
setChecklist((prev) => ({
...prev,
sections: prev.sections.map((section) =>
section.id === sectionId ? { ...section, ...updates } : section,
),
}));
};

const updateItem = (sectionId: string, itemId: string, updates: any) => {
setChecklist((prev) => ({
...prev,
sections: prev.sections.map((section) =>
section.id === sectionId
? {
  ...section,
  items: section.items.map((item) =>
  item.id === itemId ? { ...item, ...updates } : item,
  ),
  }
: section,
),
}));
};

return (
<ScrollView
style={[styles.container, { backgroundColor: colors.background }]}
showsVerticalScrollIndicator={false}
>
<View
style={[
styles.header,
{ backgroundColor: colors.surface, borderBottomColor: colors.border },
]}
>
<Text style={[styles.headerTitle, { color: colors.text }]}>
🚗 Checklist de Veículo
</Text>
</View>

<View
style={[
styles.formSection,
{ backgroundColor: colors.surface, borderColor: colors.border },
]}
>
<Text style={[styles.sectionHeader, { color: colors.text }]}>
Informações Gerais
</Text>
<TextInputField
label="Placa do Veículo"
value={checklist.plate}
onChangeText={(plate) => setChecklist((prev) => ({ ...prev, plate }))}
placeholder="Ex: ABC-1234"
/>
<TextInputField
label="KM Atual"
value={checklist.km}
onChangeText={(km) => setChecklist((prev) => ({ ...prev, km }))}
placeholder="Ex: 50000"
keyboardType="numeric"
/>
<TextInputField
label="Motorista"
value={checklist.driver}
onChangeText={(driver) => setChecklist((prev) => ({ ...prev, driver }))}
placeholder="Nome do motorista"
/>
<TextInputField
label="Data"
value={checklist.date}
onChangeText={(date) => setChecklist((prev) => ({ ...prev, date }))}
placeholder="YYYY-MM-DD"
/>
<TextInputField
label="Horário"
value={checklist.time}
onChangeText={(time) => setChecklist((prev) => ({ ...prev, time }))}
placeholder="HH:MM"
/>
</View>

{checklist.sections.map((section) => (
<ChecklistSection
key={section.id}
section={section}
onItemStatusChange={(itemId, status) =>
updateItem(section.id, itemId, { status: status as ChecklistStatus })
}
onItemNotesChange={(itemId, notes) => updateItem(section.id, itemId, { notes })}
onSectionNotesChange={(notes) =>
updateSection(section.id, { sectionNotes: notes })
}
/>
))}

<View
style={[
styles.formSection,
{ backgroundColor: colors.surface, borderColor: colors.border },
]}
>
<Text style={[styles.sectionHeader, { color: colors.text }]}>
Observações Gerais
</Text>
<TextInputField
label="Observações"
value={checklist.generalNotes}
onChangeText={(generalNotes) =>
setChecklist((prev) => ({ ...prev, generalNotes }))
}
placeholder="Adicione observações gerais do checklist..."
multiline
numberOfLines={4}
/>
</View>

<View
style={[
styles.formSection,
{ backgroundColor: colors.surface, borderColor: colors.border },
]}
>
<Text style={[styles.sectionHeader, { color: colors.text }]}>Assinaturas</Text>
<TextInputField
label="Assinatura do Motorista"
value={checklist.driverSignature}
onChangeText={(driverSignature) =>
setChecklist((prev) => ({ ...prev, driverSignature }))
}
placeholder="Nome ou iniciais"
/>
<TextInputField
label="Assinatura do Responsável pela Vistoria"
value={checklist.inspectorSignature}
onChangeText={(inspectorSignature) =>
setChecklist((prev) => ({ ...prev, inspectorSignature }))
}
placeholder="Nome ou iniciais"
/>
</View>

<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
<Text style={styles.saveButtonText}>Salvar Checklist</Text>
</TouchableOpacity>

<View style={styles.spacer} />
</ScrollView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
},
header: {
paddingHorizontal: 16,
paddingVertical: 20,
borderBottomWidth: 1,
},
headerTitle: {
fontSize: 20,
fontWeight: '700',
},
formSection: {
marginHorizontal: 12,
marginVertical: 16,
paddingHorizontal: 12,
paddingVertical: 16,
borderRadius: 12,
borderWidth: 1,
},
sectionHeader: {
fontSize: 14,
fontWeight: '700',
marginBottom: 16,
textTransform: 'uppercase',
letterSpacing: 0.5,
},
saveButton: {
marginHorizontal: 16,
marginVertical: 16,
paddingVertical: 14,
backgroundColor: '#0ea5e9',
borderRadius: 10,
alignItems: 'center',
},
saveButtonText: {
fontSize: 16,
fontWeight: '700',
color: '#fff',
},
spacer: {
height: 20,
},
});
