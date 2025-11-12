import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface OnboardingScreen2Props {
  navigation: any;
  onComplete: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ navigation, onComplete }) => {
  const handleGetStarted = () => {
    onComplete();
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Mulai Berbelanja Sekarang!</Text>
      <Text style={styles.subtitle}>
        Dapatkan penawaran terbaik dan tambahkan produk favorit Anda ke daftar.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Lewati" onPress={() => navigation.replace('MainApp')} />
        <Button title="Mulai" onPress={handleGetStarted} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 80,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default OnboardingScreen2;