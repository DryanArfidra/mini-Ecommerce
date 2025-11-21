import { useState } from 'react';
import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary, Asset, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseImagePickerReturn {
  selectedAssets: Asset[];
  uploading: boolean;
  selectImages: (options?: Partial<ImageLibraryOptions>) => Promise<Asset[]>;
  takePhoto: (options?: Partial<CameraOptions>) => Promise<Asset | null>;
  removeAsset: (index: number) => void;
  clearAssets: () => void;
  saveToAsyncStorage: (key: string) => Promise<void>;
  loadFromAsyncStorage: (key: string) => Promise<void>;
}

export const useImagePicker = (): UseImagePickerReturn => {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);

  const selectImages = async (options: Partial<ImageLibraryOptions> = {}): Promise<Asset[]> => {
    try {
      const defaultOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 5,
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8,
        includeExtra: true,
        ...options,
      };

      const result = await launchImageLibrary(defaultOptions);

      if (result.assets && result.assets.length > 0) {
        const newAssets = result.assets.filter(asset => asset.uri);
        setSelectedAssets(prev => [...prev, ...newAssets].slice(0, 5));
        return newAssets;
      }

      return [];
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'Gagal memilih foto');
      return [];
    }
  };

  const takePhoto = async (options: Partial<CameraOptions> = {}): Promise<Asset | null> => {
    try {
      const defaultOptions: CameraOptions = {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
        includeBase64: true,
        ...options,
      };

      const result = await launchCamera(defaultOptions);

      if (result.didCancel) {
        return null;
      }

      if (result.errorCode) {
        if (result.errorCode === 'camera_unavailable') {
          Alert.alert(
            'Kamera Tidak Tersedia',
            'Kamera tidak bisa dibuka. Gunakan Galeri?',
            [
              { text: 'Batal', style: 'cancel' },
              { 
                text: 'Buka Galeri', 
                onPress: () => selectImages({ selectionLimit: 1 })
              },
            ]
          );
        } else {
          Alert.alert('Error', `Error kamera: ${result.errorMessage}`);
        }
        return null;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedAssets(prev => [...prev, asset].slice(0, 5));
        return asset;
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto');
      return null;
    }
  };

  const removeAsset = (index: number) => {
    setSelectedAssets(prev => prev.filter((_, i) => i !== index));
  };

  const clearAssets = () => {
    setSelectedAssets([]);
  };

  const saveToAsyncStorage = async (key: string): Promise<void> => {
    try {
      const simplifiedAssets = selectedAssets.map(asset => ({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        base64: asset.base64,
      }));
      await AsyncStorage.setItem(key, JSON.stringify(simplifiedAssets));
    } catch (error) {
      console.error('Error saving to async storage:', error);
      throw error;
    }
  };

  const loadFromAsyncStorage = async (key: string): Promise<void> => {
    try {
      const savedAssets = await AsyncStorage.getItem(key);
      if (savedAssets) {
        setSelectedAssets(JSON.parse(savedAssets));
      }
    } catch (error) {
      console.error('Error loading from async storage:', error);
      throw error;
    }
  };

  return {
    selectedAssets,
    uploading,
    selectImages,
    takePhoto,
    removeAsset,
    clearAssets,
    saveToAsyncStorage,
    loadFromAsyncStorage,
  };
};