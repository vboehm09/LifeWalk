import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';
import { StorageService } from '../services/StorageService';

export default function OnboardingScreen({ navigation }) {
    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const handleContinue = async () => {
        if (!name.trim || !height || !weight) {
            Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.');
            return;
        }

        const profile = {
            name: name.trim(),
            height: parseFloat(height),
            weight: parseFloat(weight),
            createdAt: new Date().toISOString(),
        };

        await StorageService.saveProfile(profile);
        await StorageService.setOnboardingComplete();

        navigation.replace('Permission');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="directions-walk" size={44} color={COLORS.primary} />
                    </View>

                    <Text style={styles.title}>Vamos personalizar sua experiência</Text>
                    <Text style={styles.subtitle}>
                        Seus dados nos ajudam a calcular a distância percorrida e o ritmo ideal da caminhada.
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Seu nome"
                            placeholderTextColor={COLORS.textLight}
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.label}>Altura (cm)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 170"
                            placeholderTextColor={COLORS.textLight}
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Peso (kg)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 70"
                            placeholderTextColor={COLORS.textLight}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonPrimaryText}>Começar Jornada</Text>
                        <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    {/* Botão Secundário */}
                    <TouchableOpacity
                        style={styles.buttonSecondary}
                        onPress={() => navigation.replace('Permission')}
                    >
                        <Text style={styles.buttonSecondaryText}>Preencher mais tarde</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: METRICS.paddingLg,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: COLORS.primaryLight, // Fundo azul bem claro
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: FONTS.sizes.xxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    form: {
        marginBottom: 24,
    },
    label: {
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.text,
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: METRICS.borderRadius,
        padding: 14,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: METRICS.borderRadius,
        flexDirection: 'row', // Para alinhar o texto e a seta lado a lado
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonPrimaryText: {
        color: COLORS.white,
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.bold,
    },
    buttonSecondary: {
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonSecondaryText: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.medium,
    },
});
