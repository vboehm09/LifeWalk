import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Linking,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';
import { StorageService } from '../services/StorageService';

export default function SensorErrorScreen({ navigation }) {
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualSteps, setManualSteps] = useState('');

    const handleOpenSettings = () => {
        Linking.openSettings().catch(() =>
            Alert.alert('Erro', 'Não foi possível abrir as configurações do dispositivo.')
        );
    };

    const handleSaveManualSteps = async () => {
        if (!manualSteps || isNaN(manualSteps) || parseInt(manualSteps) < 0) {
            Alert.alert('Valor inválido', 'Por favor, insira um número válido de passos.');
            return;
        }

        await StorageService.saveDailySteps(parseInt(manualSteps, 10));

        Alert.alert(
            'Sucesso',
            `${parseInt(manualSteps).toLocaleString('pt-BR')} passos registrados manualmente!`,
            [{ text: 'OK', onPress: () => navigation.replace('Home') }]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                <View style={styles.iconContainer}>
                    <MaterialIcons name="sensor-off" size={48} color={COLORS.error} />
                </View>

                <Text style={styles.title}>Sensor Indisponível</Text>
                <Text style={styles.subtitle}>
                    Não conseguimos acessar o sensor de movimento do seu dispositivo. Sem ele, a contagem automática de passos fica desativada.
                </Text>

                <View style={styles.manualInputContainer}>
                    {!showManualInput ? (
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => setShowManualInput(true)}
                        >
                            <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                            <Text style={styles.optionTextPrimary}>Inserir Passos Manualmente</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.manualForm}>
                            <Text style={styles.label}>Quantos passos você deu hoje?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 5000"
                                placeholderTextColor={COLORS.textLight}
                                value={manualSteps}
                                onChangeText={setManualSteps}
                                keyboardType="numeric"
                            />
                            <View style={styles.manualButtonsRow}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => { setShowManualInput(false); setManualSteps(''); }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleSaveManualSteps}
                                >
                                    <Text style={styles.saveButtonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={handleOpenSettings}
                >
                    <MaterialIcons name="settings" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingsButtonText}>Ir para Configurações do Sistema</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Verifique se a permissão de "Atividade Física" está ativa nas configurações do seu aparelho.
                </Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: METRICS.paddingLg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#FEE2E2', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: FONTS.sizes.xxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    manualInputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryLight,
        padding: 16,
        borderRadius: METRICS.borderRadius,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    optionTextPrimary: {
        color: COLORS.primary,
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.bold,
        marginLeft: 8,
    },
    manualForm: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: METRICS.borderRadius,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    label: {
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.text,
        marginBottom: 12,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: METRICS.borderRadiusSm,
        padding: 12,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        marginBottom: 16,
    },
    manualButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    cancelButtonText: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.medium,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: METRICS.borderRadiusSm,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.bold,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: METRICS.borderRadius,
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
    settingsButtonText: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.medium,
        marginLeft: 8,
    },
    footerText: {
        marginTop: 24,
        fontSize: FONTS.sizes.xs,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});