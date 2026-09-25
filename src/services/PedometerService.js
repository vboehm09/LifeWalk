import { Pedometer } from 'expo-sensors';

class PedometerService {
    constructor() {
        this.subscription = null;
    }

    async isAvailable() {
        return await Pedometer.isAvailableAsync();
    }

    async requestPermissions() {
        const { status } = await Pedometer.requestPermissionsAsync();
        return status === 'granted';
    }

    async getPermissionsStatus() {
        const { status } = await Pedometer.getPermissionsAsync();
        return status;
    }

    subscribeToSteps(callback) {
        this.subscription = Pedometer.watchStepCount((result) => {
            callback(result.steps);
        });
    }

    unsubscribe() {
        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }
    }

    async getStepCountAsync(startDate, endDate) {
        try {
            const result = await Pedometer.getStepCountAsync(startDate, endDate);
            return result.steps || 0;
        } catch (error) {
            console.error("Erro ao buscar passos:", error);
            return 0;
        }
    }
}

export default new PedometerService();