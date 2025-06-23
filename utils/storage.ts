import AsyncStorage from '@react-native-async-storage/async-storage';

import { LocationData } from '@/interfaces/locationData';

const STORAGE_KEY = 'saved_locations';

export const saveLocation = async ( location: LocationData ): Promise<void> => {
  try {
    const items = await AsyncStorage.getItem( STORAGE_KEY );
    const current: LocationData[] = items ? JSON.parse( items ) : [];
    current.unshift( location );
    await AsyncStorage.setItem( STORAGE_KEY, JSON.stringify( current ) );
  } catch (e) {
    console.error('Error guardando ubicación', e);
  }
};

export const getLocations = async (): Promise<LocationData[]> => {
  try {
    const items = await AsyncStorage.getItem( STORAGE_KEY );
    return items ? JSON.parse( items ) : [];
  } catch (e) {
    console.error('Error leyendo ubicaciones', e);
    return [];
  }
};

export const clearLocations = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem( STORAGE_KEY );
  } catch (e) {
    console.error('Error al borrar ubicaciones', e);
  }
};