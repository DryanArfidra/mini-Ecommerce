import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface OnboardingScreen1Props {
  navigation: any;
}

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Selamat Datang di Mini E-Commerce!</Text>
      <Text style={styles.subtitle}>
        Temukan berbagai produk menarik dengan mudah dan cepat.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Lewati" onPress={() => navigation.replace('MainApp')} />
        <Button title="Lanjut" onPress={() => navigation.navigate('Onboarding2')} />
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

export default OnboardingScreen1;