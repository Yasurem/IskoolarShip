import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NicknameScreenProps {
  nickname: string;
  setNickname: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
}

export default function NicknameScreen({ nickname, setNickname, gender, setGender }: NicknameScreenProps) {
  const [showGender, setShowGender] = useState(false);

  useEffect(() => {
    const isValid = nickname.trim().length >= 2;
    if (isValid !== showGender) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowGender(isValid);
    }
  }, [nickname]);

  const genderOptions = [
    { key: 'Male', label: 'Male', icon: 'male' },
    { key: 'Female', label: 'Female', icon: 'female' },
    { key: 'Any', label: 'Prefer not to say', icon: 'wc' },
  ] as const;

  return (
    <View style={{ gap: 16 }}>
      {/* Nickname Input Card */}
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

      {/* Gender Selection Card (Animates In) */}
      {showGender && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Some scholarships are tailored to specific student profiles. Select your gender:</Text>
          
          <View style={styles.genderRow}>
            {genderOptions.map((opt) => {
              const isSelected = gender === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.genderButton, isSelected && styles.genderButtonActive]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setGender(opt.key);
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons 
                    name={opt.icon} 
                    size={20} 
                    color={isSelected ? '#ffffff' : '#570000'} 
                  />
                  <Text style={[styles.genderButtonText, isSelected && styles.genderButtonTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2bfb9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
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
    borderColor: '#e2bfb9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0b1c30',
    backgroundColor: '#F8FAFC',
  },
  genderRow: {
    flexDirection: 'column',
    gap: 10,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2bfb9',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 10,
  },
  genderButtonActive: {
    backgroundColor: '#570000',
    borderColor: '#570000',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#570000',
  },
  genderButtonTextActive: {
    color: '#ffffff',
  },
});
