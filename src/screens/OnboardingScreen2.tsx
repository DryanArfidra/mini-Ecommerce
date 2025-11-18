import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { OnboardingStackParamList } from '../navigation/OnboardingStack';

type OnboardingScreen2NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const OnboardingScreen2: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen2NavigationProp>();
  const { completeOnboarding } = useAuth();

  const handleGetStarted = async () => {
    // Mark onboarding as completed
    await completeOnboarding();
    // Navigation will be handled automatically by AppNavigator
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.freepik.com/premium-vector/online-shopping-concept-e-commerce-flat-set-with-man-store-shopping-cart-vector_939213-1312.jpg?semt=ais_hybrid&w=740&q=80' }}
        style={styles.image}
      />
      <Text style={styles.title}>Belanja Mudah</Text>
      <Text style={styles.description}>
        Proses belanja yang cepat dan aman dengan berbagai metode pembayaran
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Mulai Belanja</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBack}>
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backText: {
    color: '#666',
    fontSize: 14,
  },
});

export default OnboardingScreen2;