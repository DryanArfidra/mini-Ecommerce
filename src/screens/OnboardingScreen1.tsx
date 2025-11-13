import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface OnboardingScreen1Props {
  navigation: any;
}

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.freepik.com/vektor-premium/neon-sign-selamat-berbelanja-dengan-latar-belakang-dinding-bata-vektor_1182830-126.jpg' }}
        style={styles.image}
      />
      <Text style={styles.title}>Selamat Datang</Text>
      <Text style={styles.description}>
        Temukan berbagai produk terbaik dengan harga menarik
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Onboarding2')}
      >
        <Text style={styles.buttonText}>Lanjut</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Text style={styles.skipText}>Lewati</Text>
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
  skipText: {
    color: '#666',
    fontSize: 14,
  },
});

export default OnboardingScreen1;