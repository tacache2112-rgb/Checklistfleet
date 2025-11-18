import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
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

const getThemedColors = (colors: typeof Colors.light) => ({
    editBg: colors.tint || '#bfdbfe',

    editText: colors.text === '#000000' ? '#1e40af' : colors.text,

    deleteBg: colors.danger || '#fecaca',
    deleteText: colors.text === '#FFFFFF' ? '#f9acacff' : '#6a0101ff',

    primaryBg: colors.tint || '#0ea5e9',
    primaryText: colors.background === '#FFFFFF' ? '#fff' : colors.text,
});

const ChecklistListItem = ({
    checklist,
    onPress,
    onEdit,
    onDelete,
    colors,
}: {
    checklist: VehicleChecklist;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
    colors: typeof Colors.light;
}) => {
    const date = new Date(checklist.createdAt).toLocaleDateString('pt-BR');
    const themedColors = getThemedColors(colors);

    return (
        <View
            style={[
                styles.item,
                { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            <TouchableOpacity style={styles.itemContent} onPress={onPress}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>
                    {checklist.plate}
                </Text>
                <Text
                    style={[styles.itemSubtitle, { color: colors.placeholder }]}
                >
                    Motorista: {checklist.driver}
                </Text>
                <Text style={[styles.itemDate, { color: colors.placeholder }]}>
                    {date}
                </Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.editButton,
                        { backgroundColor: themedColors.editBg },
                    ]}
                    onPress={onEdit}
                >
                    <Text
                        style={[
                            styles.editButtonText,
                            { color: themedColors.editText },
                        ]}
                    >
                        Editar
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.deleteButton,
                        { backgroundColor: themedColors.deleteBg },
                    ]}
                    onPress={onDelete}
                >
                    <Text
                        style={[
                            styles.deleteButtonText,
                            { color: themedColors.deleteText },
                        ]}
                    >
                        Excluir
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const ChecklistList = ({
    onSelectChecklist,
    onCreateNew,
}: ChecklistListProps) => {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const themedColors = getThemedColors(colors);
    const { getAllChecklists, deleteChecklist } = useChecklistStorage();
    const { user } = useAuth();
    const [checklists, setChecklists] = useState<VehicleChecklist[]>([]);
    const [loading, setLoading] = useState(true);
    const filteredChecklists =
        user?.role === 'admin'
            ? checklists
            : checklists.filter((c) => c.userId === user?.id);

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
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
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
                            Alert.alert(
                                'Sucesso',
                                'Checklist excluído com sucesso',
                            );
                        } catch (error) {
                            Alert.alert(
                                'Erro',
                                'Não foi possível excluir o checklist',
                            );
                        }
                    },
                },
            ],
        );
    };

    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: colors.surface,
                        borderBottomColor: colors.border,
                    },
                ]}
            >
                <View style={styles.headerLeft}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {user?.role === 'admin'
                            ? 'Todos os Checklists'
                            : 'Meus Checklists'}
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <ThemeToggle />
                    <TouchableOpacity
                        style={[
                            styles.createButton,
                            { backgroundColor: themedColors.primaryBg },
                        ]}
                        onPress={onCreateNew}
                    >
                        <Text
                            style={[
                                styles.createButtonText,
                                { color: themedColors.primaryText },
                            ]}
                        >
                            + Novo
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {filteredChecklists.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text
                        style={[
                            styles.emptyText,
                            { color: colors.placeholder },
                        ]}
                    >
                        Nenhum checklist criado ainda
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.emptyButton,
                            { backgroundColor: themedColors.primaryBg },
                        ]}
                        onPress={onCreateNew}
                    >
                        <Text
                            style={[
                                styles.emptyButtonText,
                                { color: themedColors.primaryText },
                            ]}
                        >
                            Criar Primeiro Checklist
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredChecklists}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ChecklistListItem
                            checklist={item}
                            onPress={() => onSelectChecklist?.(item.id)}
                            onEdit={() => onSelectChecklist?.(item.id)}
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
        borderRadius: 6,
    },
    createButtonText: {
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
    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 8,
    },
    editButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
    },
    editButtonText: {
        fontSize: 11,
        fontWeight: '600',
    },
    deleteButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
    },
    deleteButtonText: {
        fontSize: 11,
        fontWeight: '600',
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
        borderRadius: 8,
    },
    emptyButtonText: {
        fontWeight: '600',
        fontSize: 14,
    },
});
