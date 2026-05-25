import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TrackerScreen() {
  return (
    <View style={styles.container}>
      <Text>Tracker Screen Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
