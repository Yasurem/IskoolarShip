import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfile } from '../context/ProfileContext';
import AcademicInformationScreen from './AcademicInformationScreen';
import PersonalContextScreen from './PersonalContextScreen';
import DocumentReadinessScreen from './DocumentReadinessScreen';

export default function Template() {
  const router = useRouter();
  const { completeOnboarding } = useProfile();
  const [step, setStep] = useState(1);
  
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

  const toggleDoc = (key: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate progress
  const isAcademicComplete = gpa.trim() !== '' && strand !== '';
  const isPersonalComplete = region !== '' && income !== '';
  const isDocsComplete = Object.values(documents).some(val => val === true);

  let canProceed = false;
  if (step === 1) canProceed = isAcademicComplete;
  if (step === 2) canProceed = isPersonalComplete;

  return (
    // Main
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header and Image */}
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

        {/* Progress Header */}
        <Text style={styles.sectionTitle}>Build Your Academic Profile</Text>
        <Text style={styles.sectionSubtitle}>Complete your profile to let our algorithm find the best scholarship matches for you.</Text>
        
        {/* Progress Description */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Setup Progress</Text>
          <Text style={styles.progressValue}>Step {step} of 3</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressSegment, isAcademicComplete ? styles.progressSegmentActive : null]} />
          <View style={[styles.progressSegment, isPersonalComplete ? styles.progressSegmentActive : null]} />
          <View style={[styles.progressSegment, isDocsComplete || step === 3 ? styles.progressSegmentActive : null]} />
        </View>
      </View>

      {/* Render Screens */}
      {/* File Ref: ../apps/mobile/src/screens/ */}
      {step === 1 && (
        <AcademicInformationScreen 
          gpa={gpa} setGpa={setGpa} strand={strand} setStrand={setStrand} 
        />
      )}
      {/* Ref: ../apps/mobile/src/screens/AcademicInformationScreen.tsx */}
      
      {step === 2 && (
        <PersonalContextScreen 
          region={region} setRegion={setRegion} income={income} setIncome={setIncome} 
        />
      )}
      {/* Ref: ../apps/mobile/src/screens/PersonalContextScreen.tsx */}

      {step === 3 && (
        <DocumentReadinessScreen 
          documents={documents} toggleDoc={toggleDoc} 
        />
      )}
      {/* Ref: ../apps/mobile/src/screens/DocumentReadinessScreen.tsx */}

      {/* Next/Back Buttons */}
      <View style={styles.navButtonsContainer}>
        {step > 1 ? (
          <TouchableOpacity 
            style={styles.backButton} 
            activeOpacity={0.8}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : <View style={{ flex: 1 }} />}

        {step < 3 ? (
          <TouchableOpacity 
            style={[styles.nextButton, !canProceed && styles.disabledButton]} 
            activeOpacity={0.8}
            onPress={() => setStep(step + 1)}
            disabled={!canProceed}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.submitButton} 
            activeOpacity={0.8}
            onPress={async () => {
              await completeOnboarding({ gpa, strand, region, income, documents });
              router.replace('/(tabs)/matches');
            }}
          >
            <Text style={styles.submitButtonText}>Find Scholarships</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// Styles for the Onboarding Screen
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
  progressBarContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 8,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  progressSegmentActive: {
    backgroundColor: '#800000',
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    color: '#3f465c',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#0b1c30',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9fa6bf',
    opacity: 0.7,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#800000',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
