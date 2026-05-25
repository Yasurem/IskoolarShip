import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomDropdown } from '../components/CustomDropdown';

import { REGIONS } from '@iskoolarship/types';
import type { Region } from '@iskoolarship/types';

interface PersonalContextScreenProps {
  region: string;
  setRegion: (v: string) => void;
  income: string;
  setIncome: (v: string) => void;
}

// Dropdown: Display Mapping for Regions
const REGION_DISPLAY_MAP: Record<Region, string> = {
  All: "All Regions",
  NCR: "NCR",
  CAR: "CAR",
  RegionI: "Region I",
  RegionII: "Region II",
  RegionIII: "Region III",
  RegionIVA: "Region IV-A",
  MIMAROPA: "MIMAROPA",
  RegionV: "Region V",
  RegionVI: "Region VI",
  RegionVII: "Region VII",
  RegionVIII: "Region VIII",
  RegionIX: "Region IX",
  RegionX: "Region X",
  RegionXI: "Region XI",
  RegionXII: "Region XII",
  RegionXIII: "Region XIII",
  BARMM: "BARMM"
};

// Get the list of UI options (excluding system keys like "All")
const DB_REGIONS = REGIONS.filter(r => r !== 'All');
const DISPLAY_OPTIONS = DB_REGIONS.map(r => REGION_DISPLAY_MAP[r]);

const INCOMES = ['Below ₱130k', '₱130k - ₱250k', '₱250k - ₱500k', '₱500k - ₱1M', 'Above ₱1M'];

export default function PersonalContextScreen({ region, setRegion, income, setIncome }: PersonalContextScreenProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Personal Context</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Home Region</Text>
        <CustomDropdown 
          // Display the user-friendly label for the current value
          value={REGION_DISPLAY_MAP[region as Region] || region} 
          options={DISPLAY_OPTIONS} 
          onSelect={(selectedLabel) => {

            // Find the corresponding database key for the selected label
            const dbValue = DB_REGIONS.find(r => REGION_DISPLAY_MAP[r] === selectedLabel);
            if (dbValue) {
              setRegion(dbValue);
            }
          }} 
          placeholder="Select region" 
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
