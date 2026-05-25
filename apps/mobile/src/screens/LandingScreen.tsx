import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';

// Simple mock for a checkbox
const Checkbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
  <TouchableOpacity style={[styles.checkboxContainer, checked && styles.checkboxChecked]} onPress={onChange} activeOpacity={0.7}>
    <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
      {checked && <View style={styles.checkmarkShape} />}
    </View>
    <Text style={[styles.checkboxLabel, checked && styles.checkboxLabelChecked]}>{label}</Text>
  </TouchableOpacity>
);

const CustomDropdown = ({ value, options, onSelect, placeholder }: { value: string, options: string[], onSelect: (v: string) => void, placeholder: string }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity 
        style={styles.mockSelect} 
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.mockSelectText, value ? styles.mockSelectTextActive : null]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, value === item && styles.modalOptionTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function LandingScreen() {
  const [documents, setDocuments] = useState({
    psa: false,
    form138: false,
    itr: false,
    gmrc: false,
  });

  const [gpa, setGpa] = useState('');
  const [strand, setStrand] = useState('');
  const [region, setRegion] = useState('');
  const [income, setIncome] = useState('');

  const STRANDS = ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Arts & Design', 'Sports'];
  const REGIONS = ['NCR', 'CAR', 'Region I', 'Region III', 'Region IV-A', 'Region VII', 'Region XI'];
  const INCOMES = ['Below ₱130k', '₱130k - ₱250k', '₱250k - ₱500k', '₱500k - ₱1M', 'Above ₱1M'];

  const toggleDoc = (key: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate progress
  const isAcademicComplete = gpa.trim() !== '' && strand !== '';
  const isPersonalComplete = region !== '' && income !== '';
  const isDocsComplete = Object.values(documents).some(val => val === true);

  let completedSections = 0;
  if (isAcademicComplete) completedSections++;
  if (isPersonalComplete) completedSections++;
  if (isDocsComplete) completedSections++;

  const progressPercentage = Math.round((completedSections / 3) * 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqeeduk0DUiunNCh2IRype84p1hmMIiaDfg-2wCwbs5tP0bJIz6mAgd8vm0i-pF3ytUxClmk_DHDUjlyIhTb23kVUjvAUZeSb0EsH83vTEU-I2jHmqcg78hT4S5CfKeYI3RpKbda05CLc4eX7qU2kCwjr-F_6i1s76f8i5LOviCi3egA_Blyqr_2Q6UWpyqiliqfDCkKMNIssF3RgrOqZB6qBfO18gQjFjEGUKiKH_xZ6r4JAjQrjEi9404mDrvOeGGWEkCZyg-wGm' }} 
            style={styles.avatar} 
          />
          <Text style={styles.headerTitle}>IskoolarShip</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Build Your Academic Profile</Text>
        <Text style={styles.sectionSubtitle}>Complete your profile to let our algorithm find the best scholarship matches for you.</Text>
        
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Setup Progress</Text>
          <Text style={styles.progressValue}>{progressPercentage}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      {/* Academic Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>
        
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senior High School Strand</Text>
          <CustomDropdown 
            value={strand} 
            options={STRANDS} 
            onSelect={setStrand} 
            placeholder="Select your strand" 
          />
        </View>
      </View>

      {/* Personal Context */}
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

      {/* Documents */}
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

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
        <Text style={styles.submitButtonText}>Find Scholarships</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#570000',
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#5a413d',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#570000',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5a413d',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#800000',
    borderRadius: 4,
  },
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
  mockSelect: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  mockSelectText: {
    color: '#9fa6bf',
    fontSize: 14,
  },
  mockSelectTextActive: {
    color: '#0b1c30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: '70%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0b1c30',
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#3f465c',
  },
  modalOptionTextSelected: {
    color: '#800000',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#5a413d',
    marginTop: 4,
    opacity: 0.7,
  },
  checkboxGrid: {
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2bfb9',
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  checkboxChecked: {
    backgroundColor: '#800000',
    borderColor: '#800000',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2bfb9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    borderColor: '#ffffff',
  },
  checkmarkShape: {
    width: 6,
    height: 12,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
    marginLeft: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0b1c30',
  },
  checkboxLabelChecked: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#800000',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  }
});
