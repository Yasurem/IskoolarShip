import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { CustomDropdown } from '../components/CustomDropdown';
import { STRANDS } from '@iskoolarship/types';
import type { Strand } from '@iskoolarship/types';

interface AcademicInformationScreenProps {
  gpa: string;
  setGpa: (v: string) => void;
  strand: string;
  setStrand: (v: string) => void;
}

const STRAND_DISPLAY_MAP: Record<Strand, string> = {
  All: 'All Strands',
  STEM: 'STEM',
  ABM: 'ABM',
  HUMSS: 'HUMSS',
  GAS: 'GAS',
  TVL: 'TVL',
  ArtsDesign: 'Arts & Design',
  Sports: 'Sports',
  NotApplicable: 'Not Applicable',
};

const DB_STRANDS = STRANDS.filter(s => s !== 'All');
const DISPLAY_OPTIONS = DB_STRANDS.map(s => STRAND_DISPLAY_MAP[s]);

export default function AcademicInformationScreen({ gpa, setGpa, strand, setStrand }: AcademicInformationScreenProps) {
  return (
    // Card Container
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Academic Information</Text>
      
      {/* Dropdown for GWA */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current General Weighted Average (GWA/GPA)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 92.5 or 1.25" 
          keyboardType="decimal-pad"
          placeholderTextColor="#9fa6bf"
          value={gpa}
          onChangeText={setGpa}
        />
        <Text style={styles.helperText}>Used for binary search eligibility filtering.</Text>
      </View>

      {/* Dropdown for Senior High School Strand */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senior High School Strand</Text>
        <CustomDropdown 
          // Display the user-friendly label for the current value
          value={STRAND_DISPLAY_MAP[strand as Strand] || strand} 
          options={DISPLAY_OPTIONS} 
          onSelect={(selectedLabel) => {

            // Find the corresponding database key for the selected label
            const dbValue = DB_STRANDS.find(s => STRAND_DISPLAY_MAP[s] === selectedLabel);
            if (dbValue) {
              setStrand(dbValue);
            }
          }} 
          placeholder="Select your strand"  
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

  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#0b1c30',
  },
  
  helperText: {
    fontSize: 12,
    color: '#5a413d',
    marginTop: 4,
    opacity: 0.7,
  },
});
