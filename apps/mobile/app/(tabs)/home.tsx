import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Display Home Screen
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
