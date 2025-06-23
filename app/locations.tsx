import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { clearLocations, getLocations } from '../utils/storage';
import { LocationData } from '@/interfaces/locationData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationList() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await getLocations();
      setLocations( data );
    };
    fetchLocations();
  }, []);

  const handleCrearLocations = async () => {
    Alert.alert(
      'Borrar ubicaciones',
      '¿Estás seguro de que deseas borrar todas las ubicaciones guardadas?',
      [   
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          onPress: () => borrarUbicaciones(),
          style: 'destructive',
        },
      ],
    );
  };
  const borrarUbicaciones = async () => {
    try {
      await clearLocations();
      setLocations([]);
      Alert.alert('Ubicaciones borradas correctamente ✅');
    } catch (error) {
      console.error('Error al borrar ubicaciones', error);
      Alert.alert('Error al borrar ubicaciones ❌');
    }
  };

  const renderItem = ({ item }: { item: LocationData }) => (
    <View style={ styles.item }>
      <Text>Fecha: { new Date( item.date ).toLocaleString() }</Text>
      <Text>Lat: { item.latitude.toFixed(5) }</Text>
      <Text>Lon: { item.longitude.toFixed(5) }</Text>
      <Text>Código Postal: { item.zipCode || 'No disponible' }</Text>
    </View>
  );

  return (
    <View style={ [ styles.container, { paddingTop: insets.top } ] }>
      <Text style={ { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' } }>Ubicaciones guardadas</Text>
      <FlatList
        data={ locations }
        keyExtractor={ ( _, index ) => index.toString() }
        renderItem={ renderItem }
      />
      <Pressable style={ styles.button } onPress={ () => router.push('/') }>
        <Text style={{ color: 'white', fontSize: 18 }}>Regresar</Text>
      </Pressable>
      {locations.length > 0 && (
        <Pressable style={ styles.clearButton } onPress={ handleCrearLocations }>
          <Text style={{ color: 'white', fontSize: 18 }}>Borrar ubicaciones</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  item: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },

  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center'
  },

  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center'
  }
});