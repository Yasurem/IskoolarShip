import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from '../components/Checkbox';

interface DocumentReadinessScreenProps {
  documents: {
    psa: boolean;
    form138: boolean;
    itr: boolean;
    gmrc: boolean;
  };
  toggleDoc: (key: 'psa' | 'form138' | 'itr' | 'gmrc') => void;
}

// Document Checklist: Helps filter scholarships based on available documents
export default function DocumentReadinessScreen({ documents, toggleDoc }: DocumentReadinessScreenProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Document Readiness</Text>
      <Text style={styles.sectionSubtitle}>Select the documents you currently have on hand. This helps filter scholarships you can apply for immediately.</Text>

      <View style={styles.checkboxGrid}>
        <Checkbox label="PSA Birth Certificate" checked={documents.psa} onChange={() => toggleDoc('psa')} />
        <Checkbox label="Form 138 (Report Card)" checked={documents.form138} onChange={() => toggleDoc('form138')} />
        <Checkbox label="Parents' ITR / Tax Exemption" checked={documents.itr} onChange={() => toggleDoc('itr')} />
        <Checkbox label="Certificate of Good Moral" checked={documents.gmrc} onChange={() => toggleDoc('gmrc')} />
      </View>
    </View>
  );
}

// Styles for the Document Readiness Screen
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#5a413d',
    marginBottom: 16,
    lineHeight: 20,
  },
  checkboxGrid: {
    gap: 12,
  },
});
