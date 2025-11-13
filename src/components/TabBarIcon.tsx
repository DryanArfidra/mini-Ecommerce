import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TabBarIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, icon, label }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { color: focused ? '#2196F3' : '#666' }]}>
        {icon}
      </Text>
      <Text style={[styles.label, { color: focused ? '#2196F3' : '#666' }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TabBarIcon;