import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AutoFillButtonProps {
    onAutoFill: () => void;
    colors: any; // Usando 'any' para flexibilidade de cor do tema
}

export const AutoFillButton = ({ onAutoFill, colors }: AutoFillButtonProps) => {
    const primaryColor = colors.primary || '#888'; // Cor de destaque para o botão
    const buttonTextColor = colors.buttonText || '#fff';

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.autoFillButton,
                    { backgroundColor: primaryColor },
                ]}
                onPress={onAutoFill}
            >
                <Text
                    style={[
                        styles.autoFillButtonText,
                        { color: buttonTextColor },
                    ]}
                >
                    ✨ Preencher Automaticamente (TESTE)
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        marginVertical: 8,
    },
    autoFillButton: {
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        opacity: 0.8,
    },
    autoFillButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
