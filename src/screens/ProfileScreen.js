import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';
import { StorageService } from '../services/StorageService';

export default function ProfileScreen({ navigation }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({ name: '', height: '', weight: '' });
    const [stepGoal, setStepGoal] = useState('10000');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const savedProfile = await StorageService.getProfile();
        const savedGoal = await StorageService.getStepGoal();

        if (savedProfile) {
            setProfile({
                name: savedProfile.name || '',
                height: String(savedProfile.height || ''),
                weight: String(savedProfile.weight || ''),
            });
        }
        if (savedGoal) {
            setStepGoal(String(savedGoal));
        }
    };

    const handleSaveChanges = async () => {
        if (!profile.name.trim() || !profile.height || !profile.weight) {
            Alert.alert('Campos obrigatórios', 'Preencha todos os dados para salvar.');
            return;
        }

        const updatedProfile = {
            ...profile,
            height: parseFloat(profile.height),
            weight: parseFloat(profile.weight),
        };

        await StorageService.saveProfile(updatedProfile);
        await StorageService.saveStepGoal(parseInt(stepGoal, 10));

        Alert.alert('Sucesso', 'Suas configurações foram salvas com sucesso!');
        setIsEditing(false);
    };

    const handleSimulateSensorError = () => {
        Alert.alert(
            'Simular Falha',
            'Isso irá simular que o sensor de passos está indisponível ou a permissão foi negada. Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Simular', onPress: () => navigation.replace('SensorError') },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Sair da conta',
            'Isso apagará seus dados locais e voltará para a tela de cadastro. Continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await StorageService.saveProfile(null);
                        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
                    }
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil e Ajustes</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                    <TouchableOpacity onPress={() => isEditing ? handleSaveChanges() : setIsEditing(true)}>
                        <Text style={styles.editButtonText}>
                            {isEditing ? 'Salvar' : 'Editar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={profile.name}
                                onChangeText={(text) => setProfile({ ...profile, name: text })}
                            />
                        ) : (
                            <Text style={styles.valueText}>{profile.name || 'Não informado'}</Text>
                        )}
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Altura (cm)</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={profile.height}
                                    onChangeText={(text) => setProfile({ ...profile, height: text })}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.valueText}>{profile.height ? `${profile.height} cm` : '--'}</Text>
                            )}
                        </View>

                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Peso (kg)</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={profile.weight}
                                    onChangeText={(text) => setProfile({ ...profile, weight: text })}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.valueText}>{profile.weight ? `${profile.weight} kg` : '--'}</Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Metas e Preferências</Text>

                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Meta Diária de Passos</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={stepGoal}
                                onChangeText={setStepGoal}
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text style={styles.valueText}>{parseInt(stepGoal).toLocaleString('pt-BR')} passos</Text>
                        )}
                    </View>

                    <View style={styles.switchRow}>
                        <View>
                            <Text style={styles.label}>Notificações Diárias</Text>
                            <Text style={styles.subLabel}>Lembrete para atingir a meta</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                            thumbColor={notificationsEnabled ? COLORS.primary : COLORS.textLight}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ferramentas de Teste</Text>
                <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleSimulateSensorError}
                >
                    <MaterialIcons name="sensor-off" size={20} color={COLORS.error} />
                    <Text style={styles.dangerButtonText}>Simular Falha no Sensor</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair e Limpar Dados</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: METRICS.paddingLg,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitle: {
        fontSize: FONTS.sizes.xl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
    },
    placeholder: {
        width: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    editButtonText: {
        color: COLORS.primary,
        fontWeight: FONTS.weights.bold,
        fontSize: FONTS.sizes.sm,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: METRICS.borderRadius,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textSecondary,
        marginBottom: 6,
        fontWeight: FONTS.weights.medium,
    },
    subLabel: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textLight,
        marginTop: 2,
    },
    valueText: {
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        fontWeight: FONTS.weights.medium,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: METRICS.borderRadiusSm,
        padding: 10,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.error,
        padding: 14,
        borderRadius: METRICS.borderRadius,
    },
    dangerButtonText: {
        color: COLORS.error,
        fontWeight: FONTS.weights.bold,
        fontSize: FONTS.sizes.md,
        marginLeft: 8,
    },
    logoutButton: {
        alignItems: 'center',
        padding: 16,
        marginTop: 16,
    },
    logoutText: {
        color: COLORS.textLight,
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.medium,
    },
});