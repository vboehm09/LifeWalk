import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import PermissionScreen from '../screens/PermissionScreen';
import HomeScreen from '../screens/HomeScreen';
import WalkScreen from '../screens/WalkScreen';
import WalkSummaryScreen from '../screens/WalkSummaryScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SensorErrorScreen from '../screens/SensorErrorScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Permission" component={PermissionScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Walk" component={WalkScreen} />
      <Stack.Screen name="WalkSummary" component={WalkSummaryScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SensorError" component={SensorErrorScreen} />
    </Stack.Navigator>
  );
}