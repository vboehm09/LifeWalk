import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, METRICS, FONTS } from '../utils/constants';

export default function PermissionScreen({ navigation }) {
    const [permissionStatus, setPermissionStatus] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSensorAndPermissions();
    }, []);

    const checkSensorAndPermissions = async () => {
        try {
            const isPedometerAvailable = await Pedometer.isAvailableAsync();
            setIsAvailable(isPedometerAvailable);

            if (!isPedometerAvailable) {
                Alert.alert(
                    'Sensor Indisponível',
                    'Seu dispositivo não possui um sensor de passos (pedômetro) compatível.'
                );
                navigation.replace('SensorError');
                return;
            }

            const { status } = await Pedometer.getPermissionsAsync();
            setPermissionStatus(status);
        } catch (error) {
            console.error("Erro ao verificar sensor:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPermission = async () => {
        setLoading(true);
        try {
            const { status } = await Pedometer.requestPermissionsAsync();
            setPermissionStatus(status);

            if (status === 'granted') {
                navigation.replace('Home');
            } else {
                navigation.replace('SensorError');
            }
        } catch (error) {
            console.error("Erro ao solicitar permissão:", error);
            Alert.alert('Erro', 'Não foi possível solicitar a permissão.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigation.replace('SensorError');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Verificando sensor...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.content}>

                <View style={styles.iconContainer}>
                    <MaterialIcons name="sensors" size={44} color={COLORS.primary} />
                </View>

                <Text style={styles.title}>Ativar Sensor de Passos</Text>
                <Text style={styles.subtitle}>
                    O LifeWalk precisa acessar o sensor de movimento do seu aparelho para contar seus passos automaticamente e calcular sua distância.
                </Text>

                {permissionStatus === 'denied' && (
                    <View style={styles.warningBox}>
                        <MaterialIcons name="warning" size={18} color={COLORS.warning} />
                        <Text style={styles.warningText}>
                            Permissão negada anteriormente. Você pode alterar isso nas configurações do seu aparelho.
                        </Text>
                    </View>
                )}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={handleRequestPermission}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonPrimaryText}>Permitir Acesso</Text>
                        <MaterialIcons name="check-circle" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonSecondary}
                        onPress={handleSkip}
                    >
                        <Text style={styles.buttonSecondaryText}>Agora não</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666666',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: '#222222',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666666',
        lineHeight: 22,
        marginBottom: 24,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
    },
    warningText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#8A6D00',
    },
    buttonsContainer: {
        width: '100%',
    },
    buttonPrimary: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonPrimaryText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 8,
    },
    buttonSecondaryText: {
        color: '#666666',
        fontSize: 16,
    },
});

