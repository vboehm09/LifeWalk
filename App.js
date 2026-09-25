import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Carregando a fonte Inter (usando a fonte do sistema como fallback caso não tenha o .ttf)
        // Se você baixou os arquivos .ttf para src/assets/fonts, use o código abaixo:
        /*
        await Font.loadAsync({
          'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
        });
        */
        
        // Para simplificar e evitar erros de arquivo não encontrado, 
        // vamos usar as fontes padrão do sistema que já se parecem com a Inter.
        // Se quiser usar a Inter de verdade, baixe os .ttf e descomente o bloco acima.
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});