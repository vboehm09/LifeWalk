import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';

export default function WalkScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [initialSteps, setInitialSteps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  const [isSensorActive, setIsSensorActive] = useState(false);
  const timerRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    startWorkout();

    return () => {
      stopTimer();
      unsubscribePedometer();
    };
  }, []);

  const startWorkout = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erro', 'Sensor de passos não disponível.');
        navigation.goBack();
        return;
      }

      const pastStepCount = await Pedometer.getStepCountAsync(
        new Date(Date.now() - 1000), 
        new Date()
      );
      setInitialSteps(pastStepCount.steps || 0);
      setSteps(pastStepCount.steps || 0);
      setIsSensorActive(true);

      startTimer();

      subscriptionRef.current = Pedometer.watchStepCount((result) => {
        if (!isPaused) {
          setSteps(result.steps);
        }
      });
    } catch (error) {
      console.error("Erro ao iniciar treino:", error);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setElapsedTime((prev) => prev + 1);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const unsubscribePedometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleFinish = () => {
    stopTimer();
    unsubscribePedometer();

    const workoutSteps = Math.max(0, steps - initialSteps);
    const distance = calculateDistance(workoutSteps);
    const pace = calculatePace(workoutSteps, elapsedTime);

    navigation.replace('WalkSummary', {
      steps: workoutSteps,
      duration: elapsedTime,
      distance: distance,
      pace: pace,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Caminhada',
      'Tem certeza que deseja cancelar? Os dados não serão salvos.',
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => {
            stopTimer();
            unsubscribePedometer();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const calculateDistance = (workoutSteps) => {
    const distanceMeters = workoutSteps * 0.7;
    return (distanceMeters / 1000).toFixed(2); // em km
  };

  const calculatePace = (workoutSteps, seconds) => {
    if (seconds === 0) return 0;
    const minutes = seconds / 60;
    return Math.round(workoutSteps / minutes);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const workoutSteps = Math.max(0, steps - initialSteps);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.neutral} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Caminhada ao Ar Livre</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, isPaused ? styles.paused : styles.active]} />
            <Text style={styles.statusText}>
              {isPaused ? 'Pausado' : 'Em andamento'}
            </Text>
          </View>
        </View>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Duração do Treino</Text>
          <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
        </View>

        {isSensorActive && !isPaused && (
          <View style={styles.sensorBadge}>
            <MaterialIcons name="sensors" size={16} color={COLORS.secondary} />
            <Text style={styles.sensorText}>Sensor Ativo • Detectando passos</Text>
          </View>
        )}

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsValue}>{workoutSteps.toLocaleString('pt-BR')}</Text>
          <Text style={styles.stepsLabel}>passos neste treino</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <MaterialIcons name="speed" size={24} color={COLORS.tertiary} />
            <Text style={styles.metricValue}>{calculatePace(workoutSteps, elapsedTime)}</Text>
            <Text style={styles.metricLabel}>passos/min</Text>
          </View>

          <View style={styles.metricBox}>
            <MaterialIcons name="route" size={24} color={COLORS.secondary} />
            <Text style={styles.metricValue}>{calculateDistance(workoutSteps)} km</Text>
            <Text style={styles.metricLabel}>distância</Text>
          </View>
        </View>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonPause]}
          onPress={togglePause}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name={isPaused ? 'play-arrow' : 'pause'} 
            size={24} 
            color={COLORS.white} 
          />
          <Text style={styles.buttonText}>
            {isPaused ? 'Retomar' : 'Pausar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonFinish]}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <MaterialIcons name="stop" size={24} color={COLORS.white} />
          <Text style={styles.buttonText}>Encerrar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral, // Fundo escuro
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: METRICS.padding,
    paddingTop: 50,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  active: {
    backgroundColor: COLORS.secondary,
  },
  paused: {
    backgroundColor: COLORS.warning,
  },
  statusText: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.xs,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: METRICS.paddingLg,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.sm,
    marginBottom: 8,
  },
  timerValue: {
    color: COLORS.white,
    fontSize: 56,
    fontWeight: FONTS.weights.bold,
    fontVariant: ['tabular-nums'], // Mantém os números alinhados
  },
  sensorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 32,
  },
  sensorText: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    marginLeft: 6,
  },
  stepsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepsValue: {
    color: COLORS.white,
    fontSize: 48,
    fontWeight: FONTS.weights.bold,
  },
  stepsLabel: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.md,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metricBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: METRICS.borderRadius,
    minWidth: 120,
  },
  metricValue: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    marginTop: 8,
  },
  metricLabel: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.xs,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: METRICS.paddingLg,
    paddingBottom: 40,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: METRICS.borderRadius,
  },
  buttonPause: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonFinish: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    marginLeft: 8,
  },
});