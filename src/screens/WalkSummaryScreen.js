import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Share,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';

export default function WalkSummaryScreen({ route, navigation }) {
    const {
        steps = 0,
        duration = 0,
        distance = '0.00',
        pace = 0
    } = route.params || {};

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSave = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Acabei de caminhar ${steps.toLocaleString('pt-BR')} passos (${distance} km) em ${formatTime(duration)} no LifeWalk! ‍♂️💨`,
            });
            if (result.action === Share.sharedAction) {

            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível compartilhar o resultado.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="emoji-events" size={56} color={COLORS.secondary} />
            </View>

            <Text style={styles.title}>Ótimo trabalho!</Text>
            <Text style={styles.subtitle}>
                Você concluiu sua caminhada e deu mais um passo rumo a uma vida mais saudável.
            </Text>

            <View style={styles.mainStatContainer}>
                <Text style={styles.mainStatValue}>{steps.toLocaleString('pt-BR')}</Text>
                <Text style={styles.mainStatLabel}>passos no total</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <MaterialIcons name="timer" size={24} color={COLORS.primary} />
                    <Text style={styles.statValue}>{formatTime(duration)}</Text>
                    <Text style={styles.statLabel}>Tempo</Text>
                </View>

                <View style={styles.statBox}>
                    <MaterialIcons name="route" size={24} color={COLORS.tertiary} />
                    <Text style={styles.statValue}>{distance} km</Text>
                    <Text style={styles.statLabel}>Distância</Text>
                </View>

                <View style={styles.statBox}>
                    <MaterialIcons name="speed" size={24} color={COLORS.secondary} />
                    <Text style={styles.statValue}>{pace}</Text>
                    <Text style={styles.statLabel}>Passos/min</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="check" size={20} color={COLORS.white} />
                    <Text style={styles.buttonPrimaryText}>Salvar e Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={handleShare}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="share" size={20} color={COLORS.primary} />
                    <Text style={styles.buttonSecondaryText}>Compartilhar Resultado</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: METRICS.paddingLg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: COLORS.secondaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: FONTS.sizes.xxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    mainStatContainer: {
        backgroundColor: COLORS.surface,
        paddingVertical: 24,
        paddingHorizontal: 40,
        borderRadius: METRICS.borderRadiusLg,
        marginBottom: 32,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    mainStatValue: {
        fontSize: 48,
        fontWeight: FONTS.weights.bold,
        color: COLORS.primary,
    },
    mainStatLabel: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: METRICS.borderRadius,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: {
        fontSize: FONTS.sizes.lg,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
        marginTop: 8,
    },
    statLabel: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    actionsContainer: {
        width: '100%',
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: METRICS.borderRadius,
        marginBottom: 12,
    },
    buttonPrimaryText: {
        color: COLORS.white,
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.bold,
        marginLeft: 8,
    },
    buttonSecondary: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: METRICS.borderRadius,
    },
    buttonSecondaryText: {
        color: COLORS.primary,
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.bold,
        marginLeft: 8,
    },
});