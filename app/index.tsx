import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

import { saveLocation } from '../utils/storage';
import { LocationData } from '@/interfaces/locationData';
import { useState } from 'react';

export default function HomeScreen() {
  const [savingLocation, setSavingLocation] = useState(false);
  const router = useRouter();

  const handleGetLocation = async () => {
    setSavingLocation(true);
    const { status: permissionStatus, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    if ( permissionStatus !== 'granted' ) {
      if ( !canAskAgain ) {
        Alert.alert(
          'Los permisos de ubicación fueron denegados permanentemente. Por favor actívalos en la configuración del sistema.'
        );
        Linking.openSettings(); 
      } else {
        Alert.alert('No se permitieron los permisos de ubicación ❌');
      }
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});

    const addressResponse = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    const newLocation: LocationData = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      date: Date.now(),
      zipCode: addressResponse[0]?.postalCode || '',
    };

    await saveLocation( newLocation );
    Alert.alert('Se guardo correctamente la ubicación ✅');
    setSavingLocation(false);
  };

  return (
    <View style={ styles.mainContainer }>
      <Pressable style={ styles.button } onPress={ handleGetLocation }>
        {savingLocation ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={ styles.buttonText }>LOCATION NOW</Text>
        )}
      </Pressable>
      <Pressable onPress={ () => router.push('/locations') }>
        <Text style={{ color: '#007AFF', fontSize: 16 }}>Ver ubicaciones guardadas</Text>
      </Pressable>
      <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0 }}>
        <Text style={{ textAlign: 'center', color: 'black' }}>
          Developed and designed by Carlos Alberto López Ibarra
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
