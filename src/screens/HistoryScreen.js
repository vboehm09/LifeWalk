import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';
import { StorageService } from '../services/StorageService';
import { Pedometer } from 'expo-sensors';

const getStepsForDay = async (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const now = new Date();

    const result = await Pedometer.getStepCountAsync(start, end > now ? now : end);
    return result.steps;
};

const DAYS = [
    { day: 'S', fullDay: 'Segunda' },
    { day: 'T', fullDay: 'Terça' },
    { day: 'Q', fullDay: 'Quarta' },
    { day: 'Q', fullDay: 'Quinta' },
    { day: 'S', fullDay: 'Sexta' },
    { day: 'S', fullDay: 'Sábado' },
    { day: 'D', fullDay: 'Domingo' },
];

// Data local no formato AAAA-MM-DD (mesmo formato usado na Home)
const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// Monta a semana atual (segunda a domingo) com os passos salvos
const buildWeekData = (history) => {
    const today = new Date();
    const todayKey = toDateKey(today);
    // getDay(): domingo = 0 ... sábado = 6 -> converte para segunda = 0 ... domingo = 6
    const todayIndex = (today.getDay() + 6) % 7;

    return DAYS.map((item, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - todayIndex + index);
        const key = toDateKey(date);

        return {
            ...item,
            steps: history[key] || 0,
            isToday: key === todayKey,
        };
    });
};

export default function HistoryScreen({ navigation }) {
    const [weekData, setWeekData] = useState(buildWeekData({}));

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await StorageService.getHistory();
                setWeekData(buildWeekData(history));
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            }
        };

        loadHistory();
        // Recarrega sempre que a tela voltar a ficar em foco
        const unsubscribe = navigation.addListener('focus', loadHistory);
        return unsubscribe;
    }, [navigation]);

    const totalSteps = weekData.reduce((acc, curr) => acc + curr.steps, 0);
    const averageSteps = Math.floor(totalSteps / 7);

    const maxStepsForChart = Math.max(10000, Math.max(...weekData.map(d => d.steps)));

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Histórico Semanal</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{totalSteps.toLocaleString('pt-BR')}</Text>
                    <Text style={styles.summaryLabel}>Passos na semana</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{averageSteps.toLocaleString('pt-BR')}</Text>
                    <Text style={styles.summaryLabel}>Média diária</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Atividade da Semana</Text>

                <View style={styles.chartArea}>
                    {weekData.map((item, index) => {
                        const barHeight = Math.max((item.steps / maxStepsForChart) * 150, 4);

                        return (
                            <View key={index} style={styles.barColumn}>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: barHeight,
                                                backgroundColor: item.isToday ? COLORS.primary : COLORS.border
                                            }
                                        ]}
                                    />
                                    {item.isToday && <View style={styles.todayMarker} />}
                                </View>

                                <Text style={[styles.dayLabel, item.isToday && styles.dayLabelActive]}>
                                    {item.day}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Detalhes Diários</Text>
                {weekData.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <View style={[styles.listDot, { backgroundColor: item.isToday ? COLORS.primary : COLORS.textLight }]} />
                            <Text style={[styles.listDay, item.isToday && styles.listDayActive]}>
                                {item.fullDay} {item.isToday && '(Hoje)'}
                            </Text>
                        </View>
                        <Text style={styles.listSteps}>{item.steps.toLocaleString('pt-BR')} passos</Text>
                    </View>
                ))}
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
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: METRICS.borderRadius,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    summaryValue: {
        fontSize: FONTS.sizes.xxl,
        fontWeight: FONTS.weights.bold,
        color: COLORS.primary,
    },
    summaryLabel: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: METRICS.borderRadiusLg,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chartTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.text,
        marginBottom: 24,
    },
    chartArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    barWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 150,
        width: '100%',
    },
    bar: {
        width: 16,
        borderRadius: 8,
    },
    todayMarker: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        position: 'absolute',
        top: -12,
    },
    dayLabel: {
        fontSize: FONTS.sizes.xs,
        color: COLORS.textLight,
        marginTop: 12,
        fontWeight: FONTS.weights.medium,
    },
    dayLabelActive: {
        color: COLORS.primary,
        fontWeight: FONTS.weights.bold,
    },
    listContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: METRICS.borderRadiusLg,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    listTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.text,
        marginBottom: 16,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    listDay: {
        fontSize: FONTS.sizes.md,
        color: COLORS.textSecondary,
    },
    listDayActive: {
        color: COLORS.text,
        fontWeight: FONTS.weights.semibold,
    },
    listSteps: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.bold,
        color: COLORS.text,
    },
});