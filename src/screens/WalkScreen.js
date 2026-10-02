import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { StorageService } from '../services/StorageService';

const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${String(h).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
};

export default function WalkScreen({ navigation }) {
    const [steps, setSteps] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [profile, setProfile] = useState(null);

    const stepsRef = useRef(0); // total atual de passos do treino
    const accumulatedRef = useRef(0); // passos de trechos anteriores (antes de pausar)
    const segmentStartRef = useRef(new Date());
    const pollRef = useRef(null);
    const subscriptionRef = useRef(null);

    // Carrega o perfil (para calcular a distância)
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const saved = await StorageService.getProfile();
                if (saved) setProfile(saved);
            } catch (e) {
                console.error("Erro ao carregar perfil:", e);
            }
        };
        loadProfile();
    }, []);

    // Cronômetro
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(timer);
    }, [isPaused]);

    // Contagem de passos (reinicia a cada pausa/retomada)
    useEffect(() => {
        if (isPaused) return;

        let cancelled = false;
        segmentStartRef.current = new Date();

        const updateSteps = (segmentSteps) => {
            if (cancelled) return;
            const total = accumulatedRef.current + segmentSteps;
            stepsRef.current = total;
            setSteps(total);
        };

        const start = async () => {
            try {
                const available = await Pedometer.isAvailableAsync();
                if (!available) {
                    Alert.alert('Sensor indisponível', 'Este dispositivo não possui pedômetro.');
                    return;
                }

                const { status } = await Pedometer.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão necessária', 'Permita o acesso ao movimento para contar os passos.');
                    return;
                }

                if (Platform.OS === 'ios') {
                    // iOS: consulta o total desde o início do trecho a cada 2 segundos
                    const poll = async () => {
                        try {
                            const result = await Pedometer.getStepCountAsync(
                                segmentStartRef.current,
                                new Date()
                            );
                            updateSteps(result.steps);
                        } catch (e) {
                            console.error("Erro ao contar passos:", e);
                        }
                    };
                    await poll();
                    pollRef.current = setInterval(poll, 2000);
                } else {
                    // Android: usa a assinatura em tempo real
                    subscriptionRef.current = Pedometer.watchStepCount((result) => {
                        updateSteps(result.steps);
                    });
                }
            } catch (error) {
                console.error("Erro ao iniciar contagem:", error);
            }
        };

        start();

        return () => {
            cancelled = true;
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
            if (subscriptionRef.current) {
                subscriptionRef.current.remove();
                subscriptionRef.current = null;
            }
        };
    }, [isPaused]);

    const togglePause = () => {
        if (!isPaused) {
            // Ao pausar, guarda o que já foi contado
            accumulatedRef.current = stepsRef.current;
        }
        setIsPaused((p) => !p);
    };

    const distanceKm = () => {
        if (!profile || !profile.height) return '0.00';
        const strideCm = profile.height * 0.415;
        return ((steps * strideCm) / 100000).toFixed(2);
    };

    const stepsPerMinute = () => {
        if (seconds < 10) return 0;
        return Math.round(steps / (seconds / 60));
    };

    const handleFinish = () => {
        navigation.replace('WalkSummary', {
            steps,
            duration: seconds,
            distance: distanceKm(),
        });
    };

    const handleClose = () => {
        Alert.alert(
            'Cancelar caminhada?',
            'O progresso deste treino será perdido.',
            [
                { text: 'Continuar', style: 'cancel' },
                { text: 'Cancelar treino', style: 'destructive', onPress: () => navigation.goBack() },
            ]
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <MaterialIcons name="close" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Caminhada ao Ar Livre</Text>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, isPaused && styles.statusDotPaused]} />
                        <Text style={styles.statusText}>{isPaused ? 'Pausado' : 'Em andamento'}</Text>
                    </View>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.main}>
                <Text style={styles.durationLabel}>Duração do Treino</Text>
                <Text style={styles.timer}>{formatTime(seconds)}</Text>

                <View style={styles.sensorBadge}>
                    <MaterialIcons name="sensors" size={18} color="#14B8A6" />
                    <Text style={styles.sensorText}>
                        {isPaused ? 'Sensor em pausa' : 'Sensor Ativo • Detectando passos'}
                    </Text>
                </View>

                <Text style={styles.stepsNumber}>{steps.toLocaleString('pt-BR')}</Text>
                <Text style={styles.stepsLabel}>passos neste treino</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <MaterialIcons name="speed" size={28} color="#6366F1" />
                        <Text style={styles.statValue}>{stepsPerMinute()}</Text>
                        <Text style={styles.statLabel}>passos/min</Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialIcons name="route" size={28} color="#14B8A6" />
                        <Text style={styles.statValue}>{distanceKm()} km</Text>
                        <Text style={styles.statLabel}>distância</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.pauseButton} onPress={togglePause} activeOpacity={0.8}>
                    <MaterialIcons name={isPaused ? 'play-arrow' : 'pause'} size={24} color="#FFFFFF" />
                    <Text style={styles.buttonText}>{isPaused ? 'Retomar' : 'Pausar'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.finishButton} onPress={handleFinish} activeOpacity={0.8}>
                    <MaterialIcons name="stop" size={24} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Encerrar</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    closeButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerSpacer: {
        width: 48,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#14B8A6',
        marginRight: 6,
    },
    statusDotPaused: {
        backgroundColor: '#F59E0B',
    },
    statusText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationLabel: {
        color: '#94A3B8',
        fontSize: 16,
    },
    timer: {
        color: '#FFFFFF',
        fontSize: 72,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    sensorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 184, 166, 0.12)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 40,
    },
    sensorText: {
        color: '#14B8A6',
        fontSize: 14,
        marginLeft: 8,
    },
    stepsNumber: {
        color: '#FFFFFF',
        fontSize: 64,
        fontWeight: 'bold',
    },
    stepsLabel: {
        color: '#94A3B8',
        fontSize: 18,
        marginBottom: 32,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    statCard: {
        flex: 1,
        maxWidth: 170,
        backgroundColor: '#1E293B',
        borderRadius: 20,
        paddingVertical: 20,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pauseButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        paddingVertical: 18,
        borderRadius: 16,
        marginRight: 8,
    },
    finishButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 18,
        borderRadius: 16,
        marginLeft: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});