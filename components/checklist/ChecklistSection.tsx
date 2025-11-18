import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { ChecklistSection as ChecklistSectionType } from '@/types/checklist';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ChecklistItem } from './ChecklistItem';

export interface ChecklistSectionProps {
    section: ChecklistSectionType;
    onItemStatusChange: (itemId: string, status: string) => void;
    onItemNotesChange: (itemId: string, notes: string) => void;
    onSectionNotesChange: (notes: string) => void;
}

export const ChecklistSection = ({
    section,
    onItemStatusChange,
    onItemNotesChange,
    onSectionNotesChange,
}: ChecklistSectionProps) => {
    const { theme } = useTheme();
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={styles.emoji}>{section.emoji}</Text>
                <Text style={[styles.title, { color: colors.text }]}>
                    {section.title}
                </Text>
            </View>

            <View style={styles.itemsContainer}>
                {section.items.map((item) => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onStatusChange={(status) =>
                            onItemStatusChange(item.id, status)
                        }
                        onNotesChange={(notes) =>
                            onItemNotesChange(item.id, notes)
                        }
                    />
                ))}
            </View>

            <View style={styles.sectionNotesContainer}>
                <Text style={[styles.notesLabel, { color: colors.text }]}>
                    Observações da Seção
                </Text>
                <TextInput
                    style={[
                        styles.notesInput,
                        {
                            borderColor: colors.border,
                            color: colors.text,
                            backgroundColor: colors.surface,
                        },
                    ]}
                    placeholder="Adicione observações específicas desta seção..."
                    placeholderTextColor={colors.placeholder}
                    value={section.sectionNotes}
                    onChangeText={onSectionNotesChange}
                    multiline
                    numberOfLines={3}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 2,
    },
    emoji: {
        fontSize: 20,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    itemsContainer: {
        marginBottom: 16,
    },
    sectionNotesContainer: {
        paddingHorizontal: 8,
        marginTop: 12,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    notesInput: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 13,
        minHeight: 80,
        textAlignVertical: 'top',
    },
});
