import type { ReactElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type SetupItem = {
  readonly label: string;
  readonly detail: string;
};

const setupItems: readonly SetupItem[] = [
  {
    label: 'Profile',
    detail: 'Local student details will power eligibility checks.',
  },
  {
    label: 'Catalog',
    detail: 'Scholarship listings will come from the read-only API.',
  },
  {
    label: 'Recommendations',
    detail: 'Matching and prioritization will run on this device.',
  },
];

export default function App(): ReactElement {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.appName}>IskoolarShip</Text>
          <Text style={styles.title}>Scholarship matching starts here.</Text>
          <Text style={styles.subtitle}>
            Build a local profile, review public scholarship data, and keep student information on-device.
          </Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeLabel}>Local privacy</Text>
          <Text style={styles.noticeText}>
            Student profiles, documents, and recommendation results stay on the phone. The API is for public catalog data only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MVP setup path</Text>
          {setupItems.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={styles.marker} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDetail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f4ee',
  },
  screen: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    rowGap: 20,
  },
  header: {
    rowGap: 10,
  },
  appName: {
    color: '#256f5b',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  title: {
    color: '#18211f',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 36,
  },
  subtitle: {
    color: '#485552',
    fontSize: 16,
    lineHeight: 23,
  },
  notice: {
    backgroundColor: '#e7f3ef',
    borderColor: '#b9d9cf',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    rowGap: 6,
  },
  noticeLabel: {
    color: '#1d5f4e',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  noticeText: {
    color: '#30423e',
    fontSize: 15,
    lineHeight: 21,
  },
  section: {
    rowGap: 12,
  },
  sectionTitle: {
    color: '#18211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  row: {
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#e0ddd5',
    borderRadius: 8,
    borderWidth: 1,
    columnGap: 12,
    flexDirection: 'row',
    padding: 14,
  },
  marker: {
    backgroundColor: '#d6a43a',
    borderRadius: 6,
    height: 12,
    marginTop: 4,
    width: 12,
  },
  rowText: {
    flex: 1,
    rowGap: 3,
  },
  rowLabel: {
    color: '#1f2927',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  rowDetail: {
    color: '#53605d',
    fontSize: 14,
    lineHeight: 20,
  },
});
