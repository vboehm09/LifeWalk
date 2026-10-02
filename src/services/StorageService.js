import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async saveProfile(profile) {
    await AsyncStorage.setItem('@vivapassos_profile', JSON.stringify(profile));
  },

  async getProfile() {
    const data = await AsyncStorage.getItem('@vivapassos_profile');
    return data ? JSON.parse(data) : null;
  },

  async saveStepGoal(goal) {
    await AsyncStorage.setItem('@vivapassos_goal', String(goal));
  },

  async getStepGoal() {
    const data = await AsyncStorage.getItem('@vivapassos_goal');
    return data ? Number(data) : null;
  },

  async setOnboardingComplete() {
    await AsyncStorage.setItem('@vivapassos_onboarding', 'true');
  },

  async hasSeenOnboarding() {
    const value = await AsyncStorage.getItem('@vivapassos_onboarding');
    return value === 'true';
  },

  async saveDailySteps(dateKey, steps) {
  const raw = await AsyncStorage.getItem('@vivapassos_history');
  const history = raw ? JSON.parse(raw) : {};
  history[dateKey] = steps;
  await AsyncStorage.setItem('@vivapassos_history', JSON.stringify(history));
},

async getHistory() {
  const raw = await AsyncStorage.getItem('@vivapassos_history');
  return raw ? JSON.parse(raw) : {};
},
};
