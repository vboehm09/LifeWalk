import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';
import { StorageService } from '../services/StorageService';

export default function HomeScreen({ navigation }) {
    const [steps, setSteps] = useState(0);
    const [profile, setProfile] = useState(null);
    const [goal, setGoal] = useState(10000);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState(true);

    useEffect(() => {
        loadData();
        subscribePedometer();

        return () => {
            this._subscription && this._subscription.remove();
        };
    }, []);

    const loadData = async () => {
        const savedProfile = await StorageService.getProfile();
        const savedGoal = await StorageService.getStepGoal();

        if (savedProfile) setProfile(savedProfile);
        if (savedGoal) setGoal(savedGoal);
    };

    const subscribePedometer = async () => {
        try {
            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(isAvailable);

            if (isAvailable) {
                this._subscription = Pedometer.watchStepCount((result) => {
                    setSteps(result.steps);
                });
            }
        } catch (error) {
            console.error("Erro ao iniciar pedômetro:", error);
        }
    };

    const getDistance = () => {
        if (!profile || !profile.height) return 0;
        const strideLength = profile.height * 0.415;
        const distanceCm = steps * strideLength;
        return (distanceCm / 100000).toFixed(2);
    };

    const getActiveMinutes = () => {
        return Math.floor(steps / 100);
    };

    const getPace = () => {
        const minutes = getActiveMinutes();
        if (minutes === 0) return 0;
        return Math.floor(steps / minutes);
    };

    const progressPercentage = Math.min((steps / goal) * 100, 100);

    if (!isPedometerAvailable) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Sensor de passos não disponível neste dispositivo.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, {profile?.name || 'Usuário'} </Text>
                    <Text style={styles.date}>Vamos nos movimentar hoje?</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <MaterialIcons name="person" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.ringContainer}>
                <View style={[styles.ring, { borderColor: COLORS.primary }]}>
                    <View style={styles.ringInner}>
                        <Text style={styles.stepsNumber}>{steps.toLocaleString('pt-BR')}</Text>
                        <Text style={styles.stepsLabel}>passos</Text>
                        <Text style={styles.goalText}>Meta: {goal.toLocaleString('pt-BR')}</Text>
                    </View>
                </View>
                <Text style={styles.progressText}>{Math.floor(progressPercentage)}% concluído</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <MaterialIcons name="route" size={24} color={COLORS.secondary} />
                    <Text style={styles.statValue}>{getDistance()} km</Text>
                    <Text style={styles.statLabel}>Distância</Text>
                </View>

                <View style={styles.statCard}>
                    <MaterialIcons name="timer" size={24} color={COLORS.tertiary} />
                    <Text style={styles.statValue}>{getActiveMinutes()} min</Text>
                    <Text style={styles.statLabel}>Ativo</Text>
                </View>

                <View style={styles.statCard}>
                    <MaterialIcons name="speed" size={24} color={COLORS.primary} />
                    <Text style={styles.statValue}>{getPace()}</Text>
                    <Text style={styles.statLabel}>Passos/min</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('Walk')}
                activeOpacity={0.8}
            >
                <MaterialIcons name="directions-walk" size={24} color={COLORS.white} />
                <Text style={styles.startButtonText}>Iniciar Caminhada</Text>
            </TouchableOpacity>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('History')}>
                    <MaterialIcons name="bar-chart" size={24} color={COLORS.textLight} />
                    <Text style={styles.navText}>Histórico</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                    <MaterialIcons name="settings" size={24} color={COLORS.textLight} />
                    <Text style={styles.navText}>Ajustes</Text>
                </TouchableOpacity>
            </View>

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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONTS.sizes.md,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    greeting: {
        fontSize: FONTS.sizes.xl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
    },
    date: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    ring: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 12,
        borderColor: COLORS.gray,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    ringInner: {
        alignItems: 'center',
    },
    stepsNumber: {
        fontSize: 42,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
    },
    stepsLabel: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textSecondary,
        marginTop: 8,
    },
    goalText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textLight,
        fontWeight: FONTS.weights.medium,
    },
    progressText: {
        marginTop: 16,
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.primary,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: METRICS.borderRadius,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
    startButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        borderRadius: METRICS.borderRadiusLg,
        marginBottom: 32,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startButtonText: {
        color: COLORS.white,
        fontSize: FONTS.sizes.lg,
        fontWeight: FONTS.weights.bold,
        marginLeft: 8,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 16,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textLight,
        marginTop: 4,
    },
});