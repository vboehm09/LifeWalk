import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async saveProfile(profile) {
    await AsyncStorage.setItem('@vivapassos_profile', JSON.stringify(profile));
  },

  async getProfile() {
    const data = await AsyncStorage.getItem('@vivapassos_profile');
    return data ? JSON.parse(data) : null;
  },

  async setOnboardingComplete() {  // ← SEM "d" no final
    await AsyncStorage.setItem('@vivapassos_onboarding', 'true');
  },

  async hasSeenOnboarding() {
    const value = await AsyncStorage.getItem('@vivapassos_onboarding');
    return value === 'true';
  },
};