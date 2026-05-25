import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../src/context/ProfileContext';
import { CustomDropdown } from '../../src/components/CustomDropdown';
import { 
  REGION_DISPLAY_MAP, 
  INCOME_DISPLAY_MAP, 
  STRAND_DISPLAY_MAP, 
  REGIONS, 
  STRANDS 
} from '@iskoolarship/types';
import type { Region, IncomeBracket, Strand } from '@iskoolarship/types';

const DB_REGIONS = REGIONS.filter(r => r !== 'All');
const REGION_OPTIONS = DB_REGIONS.map(r => REGION_DISPLAY_MAP[r]);

const DB_STRANDS = STRANDS.filter(s => s !== 'All');
const STRAND_OPTIONS = DB_STRANDS.map(s => STRAND_DISPLAY_MAP[s]);

const DB_INCOMES: IncomeBracket[] = [1, 2, 3, 4, 5];
const INCOME_OPTIONS = DB_INCOMES.map(i => INCOME_DISPLAY_MAP[i]);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, resetProfile, completeOnboarding } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [gpa, setGpa] = useState('');
  const [strand, setStrand] = useState('');
  const [region, setRegion] = useState('');
  const [income, setIncome] = useState('');
  const [documents, setDocuments] = useState({
    psa: false,
    form138: false,
    itr: false,
    gmrc: false,
  });

  // Sync state with profile data when entering Edit Mode or on profile load
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || '');
      setGender(profile.gender || 'Any');
      setGpa(profile.gpa || '');
      setStrand(profile.strand || '');
      setRegion(profile.region || '');
      setIncome(profile.income || '');
      setDocuments(profile.documents || { psa: false, form138: false, itr: false, gmrc: false });
    }
  }, [profile, isEditing]);

  const handleReset = () => {
    Alert.alert(
      "Reset Profile",
      "Are you sure you want to delete your profile data? This will clear all saved details and restart the onboarding process.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset & Restart", style: "destructive", onPress: resetProfile }
      ]
    );
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert("Required Input", "Please enter your nickname.");
      return;
    }
    if (!gpa.trim() || isNaN(parseFloat(gpa))) {
      Alert.alert("Required Input", "Please enter a valid GWA/GPA (e.g. 1.25 or 90.0).");
      return;
    }
    if (!strand) {
      Alert.alert("Required Input", "Please select your strand.");
      return;
    }

    try {
      await completeOnboarding({
        nickname: nickname.trim(),
        gender,
        gpa: gpa.trim(),
        strand,
        region,
        income,
        documents,
        trackedIds: profile?.trackedIds // preserve tracked IDs
      });
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (e) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const toggleDoc = (key: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, styles.center]}>
        <ActivityIndicator size="large" color="#570000" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="person" size={28} color="#570000" style={{marginRight: 8}} />
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit Profile" : `Hi, ${profile.nickname || "Scholar"}!`}
          </Text>
        </View>
        {!isEditing && (
          <TouchableOpacity 
            style={styles.editHeaderButton} 
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={20} color="#570000" />
            <Text style={styles.editHeaderText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isEditing ? (
          /* EDIT MODE VIEW */
          <View style={{ gap: 16 }}>
            {/* Personal Basics Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Basics</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nickname / Username</Text>
                <TextInput
                  style={styles.textInput}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="e.g. Juan, Maria, Alex"
                  placeholderTextColor="#9fa6bf"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  {[
                    { key: 'Male', label: 'Male', icon: 'male' },
                    { key: 'Female', label: 'Female', icon: 'female' },
                    { key: 'Any', label: 'Prefer not to say', icon: 'wc' }
                  ].map((opt) => {
                    const isSelected = gender === opt.key;
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        style={[styles.genderButton, isSelected && styles.genderButtonActive]}
                        onPress={() => setGender(opt.key)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons 
                          name={opt.icon as any} 
                          size={18} 
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
            </View>

            {/* Academic Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Academic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current GWA / GPA</Text>
                <TextInput
                  style={styles.textInput}
                  value={gpa}
                  onChangeText={setGpa}
                  placeholder="e.g. 1.25 or 90.0"
                  placeholderTextColor="#9fa6bf"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senior High School Strand</Text>
                <CustomDropdown
                  value={STRAND_DISPLAY_MAP[strand as Strand] || strand}
                  options={STRAND_OPTIONS}
                  onSelect={(selectedLabel) => {
                    const dbValue = DB_STRANDS.find(s => STRAND_DISPLAY_MAP[s] === selectedLabel);
                    if (dbValue) setStrand(dbValue);
                  }}
                  placeholder="Select your strand"
                />
              </View>
            </View>

            {/* Household context card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Household Context</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Home Region</Text>
                <CustomDropdown
                  value={REGION_DISPLAY_MAP[region as Region] || region}
                  options={REGION_OPTIONS}
                  onSelect={(selectedLabel) => {
                    const dbValue = DB_REGIONS.find(r => REGION_DISPLAY_MAP[r] === selectedLabel);
                    if (dbValue) setRegion(dbValue);
                  }}
                  placeholder="Select region"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Annual Household Income</Text>
                <CustomDropdown
                  value={INCOME_DISPLAY_MAP[parseInt(income) as IncomeBracket] || income}
                  options={INCOME_OPTIONS}
                  onSelect={(selectedLabel) => {
                    const dbValue = DB_INCOMES.find(i => INCOME_DISPLAY_MAP[i] === selectedLabel);
                    if (dbValue) setIncome(dbValue.toString());
                  }}
                  placeholder="Select Income Bracket"
                />
              </View>
            </View>

            {/* Documents Readiness Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Document Status</Text>
              
              <TouchableOpacity style={styles.docRowEdit} onPress={() => toggleDoc('psa')} activeOpacity={0.7}>
                <Text style={styles.docName}>PSA Birth Certificate</Text>
                <MaterialIcons 
                  name={documents.psa ? "check-box" : "check-box-outline-blank"} 
                  size={24} 
                  color="#570000" 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.docRowEdit} onPress={() => toggleDoc('form138')} activeOpacity={0.7}>
                <Text style={styles.docName}>Form 138 (Report Card)</Text>
                <MaterialIcons 
                  name={documents.form138 ? "check-box" : "check-box-outline-blank"} 
                  size={24} 
                  color="#570000" 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.docRowEdit} onPress={() => toggleDoc('itr')} activeOpacity={0.7}>
                <Text style={styles.docName}>Income Tax Return (ITR)</Text>
                <MaterialIcons 
                  name={documents.itr ? "check-box" : "check-box-outline-blank"} 
                  size={24} 
                  color="#570000" 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.docRowEdit} onPress={() => toggleDoc('gmrc')} activeOpacity={0.7}>
                <Text style={styles.docName}>GMRC Certificate</Text>
                <MaterialIcons 
                  name={documents.gmrc ? "check-box" : "check-box-outline-blank"} 
                  size={24} 
                  color="#570000" 
                />
              </TouchableOpacity>
            </View>

            {/* Edit CTA Buttons */}
            <View style={styles.editCtaRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)} activeOpacity={0.8}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                <MaterialIcons name="save" size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* READ-ONLY VIEW (DEFAULT) */
          <View style={{ gap: 16 }}>
            {/* Profile Details Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Academic & Personal Details</Text>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="grade" size={20} color="#570000" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>GPA / GWA</Text>
                  <Text style={styles.value}>{profile.gpa}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="school" size={20} color="#570000" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Senior High Strand</Text>
                  <Text style={styles.value}>{STRAND_DISPLAY_MAP[profile.strand as Strand] || profile.strand}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="wc" size={20} color="#570000" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Gender</Text>
                  <Text style={styles.value}>{profile.gender === 'Any' ? 'Prefer not to say' : profile.gender}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="place" size={20} color="#570000" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Home Region</Text>
                  <Text style={styles.value}>{REGION_DISPLAY_MAP[profile.region as Region] || profile.region}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="payments" size={20} color="#570000" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Annual Household Income</Text>
                  <Text style={styles.value}>{INCOME_DISPLAY_MAP[parseInt(profile.income) as IncomeBracket] || profile.income}</Text>
                </View>
              </View>
            </View>

            {/* Documents Status Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Document Status</Text>
              
              <View style={styles.docRow}>
                <Text style={styles.docName}>PSA Birth Certificate</Text>
                {profile.documents.psa ? (
                  <View style={styles.badgeSuccess}><Text style={styles.badgeSuccessText}>UPLOADED</Text></View>
                ) : (
                  <View style={styles.badgeMissing}><Text style={styles.badgeMissingText}>MISSING</Text></View>
                )}
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docName}>Form 138 (Report Card)</Text>
                {profile.documents.form138 ? (
                  <View style={styles.badgeSuccess}><Text style={styles.badgeSuccessText}>UPLOADED</Text></View>
                ) : (
                  <View style={styles.badgeMissing}><Text style={styles.badgeMissingText}>MISSING</Text></View>
                )}
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docName}>Income Tax Return (ITR)</Text>
                {profile.documents.itr ? (
                  <View style={styles.badgeSuccess}><Text style={styles.badgeSuccessText}>UPLOADED</Text></View>
                ) : (
                  <View style={styles.badgeMissing}><Text style={styles.badgeMissingText}>MISSING</Text></View>
                )}
              </View>

              <View style={styles.docRow}>
                <Text style={styles.docName}>GMRC Certificate</Text>
                {profile.documents.gmrc ? (
                  <View style={styles.badgeSuccess}><Text style={styles.badgeSuccessText}>UPLOADED</Text></View>
                ) : (
                  <View style={styles.badgeMissing}><Text style={styles.badgeMissingText}>MISSING</Text></View>
                )}
              </View>
            </View>

            {/* Danger Zone Reset Card */}
            <View style={styles.cardDanger}>
              <Text style={styles.cardDangerTitle}>Reset Session</Text>
              <Text style={styles.dangerText}>
                Clearing your session data will completely delete your local profile inputs and tracked scholarships list from this device. You will be redirected back to the onboarding wizard.
              </Text>
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <MaterialIcons name="refresh" size={20} color="#ffffff" />
                <Text style={styles.resetButtonText}>Reset Profile & Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2bfb9',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#570000',
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#570000',
    borderRadius: 16,
  },
  editHeaderText: {
    color: '#570000',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#570000',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#5a413d',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b1c30',
    marginTop: 2,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  docRowEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  docName: {
    fontSize: 14,
    color: '#0b1c30',
    fontWeight: '500',
  },
  badgeSuccess: {
    backgroundColor: '#fdc425',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccessText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6d5200',
  },
  badgeMissing: {
    backgroundColor: '#ffdad6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeMissingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#93000a',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
    fontSize: 14,
    color: '#0b1c30',
    backgroundColor: '#F8FAFC',
  },
  genderRow: {
    flexDirection: 'column',
    gap: 8,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2bfb9',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: '#570000',
    borderColor: '#570000',
  },
  genderButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#570000',
  },
  genderButtonTextActive: {
    color: '#ffffff',
  },
  editCtaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2bfb9',
  },
  cancelButtonText: {
    color: '#5a413d',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#570000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardDanger: {
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#feb2b2',
  },
  cardDangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c53030',
    marginBottom: 8,
  },
  dangerText: {
    fontSize: 14,
    color: '#742a2a',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#e53e3e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
