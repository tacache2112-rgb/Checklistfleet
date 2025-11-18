import { ChecklistForm } from '@/components/checklist/ChecklistForm';
import { ChecklistList } from '@/components/checklist/ChecklistList';
import { VehicleChecklist } from '@/types/checklist';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type ViewMode = 'list' | 'create' | 'edit';

export default function ChecklistScreen() {
const [viewMode, setViewMode] = useState<ViewMode>('list');
const [selectedId, setSelectedId] = useState<string | null>(null);

const handleSelectChecklist = (id: string) => {
setSelectedId(id);
setViewMode('edit');
};

const handleCreateNew = () => {
setSelectedId(null);
setViewMode('create');
};

const handleSave = (checklist: VehicleChecklist) => {
setViewMode('list');
setSelectedId(null);
};

const handleGoBack = () => {
setViewMode('list');
setSelectedId(null);
};

if (viewMode === 'create' || viewMode === 'edit') {
return (
<View style={styles.container}>
<ChecklistForm checklistId={selectedId || undefined} onSave={handleSave} />
</View>
);
}

return (
<View style={styles.container}>
<ChecklistList
onSelectChecklist={handleSelectChecklist}
onCreateNew={handleCreateNew}
/>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
});
