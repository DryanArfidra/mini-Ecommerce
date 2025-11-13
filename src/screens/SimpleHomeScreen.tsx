import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView 
} from 'react-native';

const SimpleHomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>SELAMAT DATANG!</Text>
          <Text style={styles.subtitle}>Test tanpa navigation complex</Text>
        </View>
        
        <View style={styles.testBox}>
          <Text style={styles.testText}>
            Jika text ini terlihat lengkap dan tidak tertutup notch, berarti masalahnya di navigation hierarchy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    backgroundColor: 'lightblue',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'darkblue',
  },
  subtitle: {
    fontSize: 16,
    color: 'darkblue',
  },
  testBox: {
    padding: 20,
    backgroundColor: 'lightgreen',
    margin: 10,
    borderRadius: 10,
  },
  testText: {
    fontSize: 16,
    color: 'darkgreen',
    textAlign: 'center',
  },
});

export default SimpleHomeScreen;