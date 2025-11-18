// TODO: Fazer com que o docx criado fique com apenas 1 página.

import { VehicleChecklist } from '@/types/checklist';
// Mantendo as importações originais, apesar dos potenciais erros de tipagem local
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

/**
 * Hook customizado para exportação .DOC (texto formatado simples).
 * @returns { exportDocx }
 */
export const useDocxExport = () => {
    // Função compactada para gerar conteúdo de texto
    const generateDocContent = (checklist: VehicleChecklist): string => {
        let content = `CHECKLIST DE VEÍCULO - ${checklist.plate}\n`;
        content += `==========================================\n\n`;
        content += `Motorista: ${checklist.driver}\nKM Atual: ${checklist.km}\nData/Hora: ${checklist.date} ${checklist.time}\n\n`;

        checklist.sections.forEach((section) => {
            content += `--- ${section.emoji} ${section.title.toUpperCase()} ---\n`;
            section.items.forEach((item) => {
                const status = item.status ? item.status.toUpperCase() : 'N/A';
                content += `- [${status}]: ${item.name}`;
                if (item.notes) content += `    (Nota: ${item.notes})`;
                content += '\n';
            });
            if (section.sectionNotes)
                content += `Obs. Seção: ${section.sectionNotes}\n`;
            content += '\n';
        });

        if (checklist.generalNotes)
            content += `OBSERVAÇÕES GERAIS:\n ${checklist.generalNotes}\n\n`;

        content += `------------------------------------------\n`;
        content += `Assinatura Motorista: ${checklist.driverSignature || 'Não assinada'}\n`;
        content += `Assinatura Inspetor: ${checklist.inspectorSignature || 'Não assinada'}\n`;

        return content;
    };

    const exportDocx = async (checklist: VehicleChecklist) => {
        try {
            const fileName = `Checklist_${checklist.plate.replace(/[^a-zA-Z0-9]/g, '_')}_${checklist.date}.doc`;
            const docContent = generateDocContent(checklist);

            if (Platform.OS === 'web') {
                const blob = new Blob([docContent], {
                    type: 'text/plain;charset=utf-8',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                Alert.alert(
                    'Exportação',
                    `O arquivo ${fileName} foi gerado e o download deve ter sido iniciado.`,
                    [{ text: 'OK' }],
                );
            } else {
                // Lógica Mobile: Utiliza as APIs de File e Paths do expo-file-system (mantido como solicitado)
                const fileUri = Paths.cache + fileName;

                // Note: Esta chamada depende da sua configuração local e pode gerar erros de tipagem
                await new File(fileUri).write(docContent, { encoding: 'utf8' });

                if (!(await Sharing.isAvailableAsync())) {
                    Alert.alert(
                        'Erro',
                        'Compartilhamento não disponível neste dispositivo.',
                    );
                    return;
                }

                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/msword',
                    dialogTitle: 'Compartilhar Checklist DOC',
                });
            }
        } catch (error) {
            console.error('Erro real ao exportar DOC:', error);
            Alert.alert(
                'Erro',
                'Não foi possível gerar ou compartilhar o arquivo DOC. Verifique os logs do console.',
                [{ text: 'OK' }],
            );
        }
    };

    return { exportDocx };
};
