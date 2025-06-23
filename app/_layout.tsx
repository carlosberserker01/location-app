import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if ( !loaded ) return null;

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
