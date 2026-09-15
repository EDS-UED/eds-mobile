import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { mobileTheme } from '@eds/mobile-tokens/theme';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { ComponentPreviewScreen } from './src/screens/ComponentPreviewScreen';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: mobileTheme.colors.light.page as string },
          headerTintColor: mobileTheme.colors.light['text-base-primary'] as string,
          contentStyle: { backgroundColor: mobileTheme.colors.light.page as string },
        }}
      >
        <Stack.Screen
          name="Catalog"
          component={CatalogScreen}
          options={{ title: 'EDS Mobile' }}
        />
        <Stack.Screen
          name="ComponentPreview"
          component={ComponentPreviewScreen}
          options={({ route }) => ({ title: route.params.exportName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
