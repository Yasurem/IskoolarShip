import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomDropdown } from '../components/CustomDropdown';

interface PersonalContextScreenProps {
  region: string;
  setRegion: (v: string) => void;
  income: string;
  setIncome: (v: string) => void;
}

const REGIONS = ['NCR', 'CAR', 'Region I', 'Region III', 'Region IV-A', 'Region VII', 'Region XI'];
const INCOMES = ['Below ₱130k', '₱130k - ₱250k', '₱250k - ₱500k', '₱500k - ₱1M', 'Above ₱1M'];

export default function PersonalContextScreen({ region, setRegion, income, setIncome }: PersonalContextScreenProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Personal Context</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Home Region</Text>
        <CustomDropdown 
          value={region} 
          options={REGIONS} 
          onSelect={setRegion} 
          placeholder="Select Region" 
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Annual Household Income</Text>
        <CustomDropdown 
          value={income} 
          options={INCOMES} 
          onSelect={setIncome} 
          placeholder="Select Income Bracket" 
        />
        <Text style={styles.helperText}>Critical for financial aid weighted scoring.</Text>
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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2bfb9',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5a413d',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#5a413d',
    marginTop: 4,
    opacity: 0.7,
  },
});
