import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../src/context/ProfileContext';

const REGION_DISPLAY_MAP: Record<string, string> = {
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

const INCOME_DISPLAY_MAP: Record<string, string> = {
  '1': 'Below ₱130k',
  '2': '₱130k - ₱250k',
  '3': '₱250k - ₱500k',
  '4': '₱500k - ₱1M',
  '5': 'Above ₱1M',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, resetProfile } = useProfile();

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
          <Text style={styles.headerTitle}>Hi, {profile.nickname || "Scholar"}!</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
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
              <Text style={styles.value}>{profile.strand}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={20} color="#570000" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Home Region</Text>
              <Text style={styles.value}>{REGION_DISPLAY_MAP[profile.region] || profile.region}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="payments" size={20} color="#570000" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Annual Household Income</Text>
              <Text style={styles.value}>{INCOME_DISPLAY_MAP[profile.income] || profile.income}</Text>
            </View>
          </View>
        </View>

        {/* Documents Card */}
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

        {/* Reset Session Card */}
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
