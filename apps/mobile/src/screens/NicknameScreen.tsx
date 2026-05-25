import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface NicknameScreenProps {
  nickname: string;
  setNickname: (v: string) => void;
}

export default function NicknameScreen({ nickname, setNickname }: NicknameScreenProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Welcome to IskoolarShip!</Text>
      <Text style={styles.subtitle}>Before we begin matching scholarships, what should we call you?</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nickname / Username</Text>
        <TextInput
          style={styles.textInput}
          value={nickname}
          onChangeText={setNickname}
          placeholder="e.g. Juan, Maria, Alex"
          placeholderTextColor="#9fa6bf"
          autoFocus={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#570000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5a413d',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5a413d',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0b1c30',
    backgroundColor: '#F8FAFC',
  },
});
