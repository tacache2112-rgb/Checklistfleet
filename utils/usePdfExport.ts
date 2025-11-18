import { VehicleChecklist } from '@/types/checklist';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export const usePdfExport = () => {
    const generateHtmlContent = (checklist: VehicleChecklist): string => {
        const signatureLine = (label: string, value: string) =>
            value
                ? `<div class="signature-item"><p class="signature-label">${label}</p><p class="signature-value">${value}</p></div>`
                : '';

        const issueCount = checklist.sections.reduce(
            (sum, s) =>
                sum + s.items.filter((item) => item.status === 'ruim').length,
            0,
        );

        const sectionsHtml = checklist.sections
            .map(
                (section) => `
                    <div class="section">
                        <div class="section-header">${section.emoji} ${section.title.toUpperCase()}</div>
                        ${section.items
                            .map(
                                (item) => `
                            <div class="item-row">
                                <span class="item-name">${item.name}</span>
                                <span class="item-status" style="color: ${item.status === 'ruim' ? '#d9534f' : item.status === 'ok' ? '#5cb85c' : '#f0ad4e'};">
                                    ${item.status ? item.status.toUpperCase() : 'N/A'}
                                </span>
                            </div>
                        `,
                            )
                            .join('')}
                        ${section.sectionNotes ? `<div class="notes"><p class="notes-label">Obs. da Seção:</p><p>${section.sectionNotes}</p></div>` : ''}
                    </div>
                `,
            )
            .join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                <title>Checklist ${checklist.plate}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 15px; font-size: 11px; color: #333; width: 100%; }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
                    .title { font-size: 18px; font-weight: bold; margin: 0; }
                    .subtitle { color: #555; margin: 0; font-size: 14px; }
                    .issue-status { color: ${issueCount > 0 ? '#d9534f' : '#5cb85c'}; font-weight: bold; margin-top: 5px; }
                    .info-grid { display: flex; flex-wrap: wrap; margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
                    .info-grid > div { width: 50%; padding: 3px 0; }
                    .section { margin-bottom: 20px; page-break-inside: avoid; }
                    .section-header { font-size: 13px; font-weight: bold; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px solid #ccc; }
                    .item-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #eee; }
                    .item-name { flex: 1; margin-right: 10px; }
                    .item-status { font-weight: bold; font-size: 10px; }
                    .notes { background-color: #f0f0f0; padding: 8px; border-radius: 4px; margin-top: 5px; font-size: 10px; }
                    .notes-label { font-weight: bold; color: #777; }
                    .signatures-container { display: flex; justify-content: space-around; margin-top: 40px; }
                    .signature-item { text-align: center; width: 45%; padding-top: 10px; }
                    .signature-value { border-bottom: 1px solid #000; padding: 5px; margin-bottom: 5px; font-style: italic; }
                    .signature-label { font-size: 10px; color: #555; }
                </style>
            </head>
            <body>
                <div class="header">
                    <p class="title">Checklist de Veículo</p>
                    <p class="subtitle">${checklist.plate} - ${checklist.driver}</p>
                    <p class="issue-status">${issueCount > 0 ? `⚠️ ${issueCount} PONTOS NÃO CONFORMES` : '✅ TUDO OK'}</p>
                </div>

                <div class="info-grid">
                    <div><strong>KM Atual:</strong> ${checklist.km}</div>
                    <div><strong>Data/Hora:</strong> ${checklist.date} ${checklist.time}</div>
                </div>

                ${sectionsHtml}

                ${
                    checklist.generalNotes
                        ? `
                    <div class="section notes">
                        <p class="notes-label">Observações Gerais:</p>
                        <p>${checklist.generalNotes}</p>
                    </div>
                `
                        : ''
                }

                <div class="signatures-container">
                    ${signatureLine('Assinatura do Motorista', checklist.driverSignature)}
                    ${signatureLine('Assinatura do Inspetor', checklist.inspectorSignature)}
                </div>

            </body>
            </html>
        `;
    };

    const exportPdf = async (checklist: VehicleChecklist) => {
        const htmlContent = generateHtmlContent(checklist);
        const fileName = `Checklist_${checklist.plate.replace(/[^a-zA-Z0-9]/g, '_')}_${checklist.date}.pdf`;

        try {
            // 🔥 1. WEB — NÃO usar Print.printToFileAsync
            if (Platform.OS === 'web') {
                const printWindow = window.open('', '_blank');

                if (!printWindow) {
                    alert('Permita pop-ups para gerar o PDF.');
                    return;
                }

                printWindow.document.open();
                printWindow.document.write(htmlContent);
                printWindow.document.close();

                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                };

                return;
            }

            // 🔥 2. MOBILE — aqui sim pode chamar printToFileAsync
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                width: 612,
                height: 792,
                base64: false,
            });

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Erro', 'Compartilhamento não disponível.');
                return;
            }

            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Compartilhar Checklist PDF',
            });
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            Alert.alert('Erro', 'Não foi possível gerar/compartilhar o PDF.');
        }
    };

    return { exportPdf };
};
