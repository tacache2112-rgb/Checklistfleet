import { VehicleChecklist } from '@/types/checklist';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@checklistfleet:checklists';

export const useChecklistStorage = () => {
    const { getItem, setItem, removeItem } = useAsyncStorage(STORAGE_KEY);

    const getAllChecklists = async (): Promise<VehicleChecklist[]> => {
        try {
            const data = await getItem();
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading checklists:', error);
            return [];
        }
    };

    const saveChecklist = async (checklist: VehicleChecklist): Promise<void> => {
        try {
            const checklists = await getAllChecklists();
            const index = checklists.findIndex((c) => c.id === checklist.id);

            if (index >= 0) {
                checklists[index] = checklist;
            } else {
                checklists.push(checklist);
            }

            await setItem(JSON.stringify(checklists));
        } catch (error) {
            console.error('Error saving checklist:', error);
            throw error;
        }
    };

    const loadChecklist = async (id: string): Promise<VehicleChecklist | null> => {
        try {
            const checklists = await getAllChecklists();
            return checklists.find((c) => c.id === id) || null;
        } catch (error) {
            console.error('Error loading checklist:', error);
            return null;
        }
    };

    const deleteChecklist = async (id: string): Promise<void> => {
        try {
            const checklists = await getAllChecklists();
            const filtered = checklists.filter((c) => c.id !== id);
            await setItem(JSON.stringify(filtered));
        } catch (error) {
            console.error('Error deleting checklist:', error);
            throw error;
        }
    };

    return {
        getAllChecklists,
        saveChecklist,
        loadChecklist,
        deleteChecklist,
    };
};
