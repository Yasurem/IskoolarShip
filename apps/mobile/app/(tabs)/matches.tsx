import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CardProps = {
  title: string;
  type: string;
  match: string;
  amount: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const ScholarshipCard = ({ title, type, match, amount, icon }: CardProps) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={24} color="#570000" />
        </View>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{type}</Text>
          </View>
        </View>
      </View>
      <View style={styles.matchBadge}>
        <MaterialIcons name="verified" size={16} color="#5a4300" />
        <Text style={styles.matchText}>{match}</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.footerLabel}>Potential Amount</Text>
      <Text style={styles.footerAmount}>{amount}</Text>
    </View>
  </TouchableOpacity>
);

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm4wpN8C_oQNAj7W_yBo5dVFL5muEOm4jZxUHVfKv2DFHZ3VrI78ZtS_k21CkX96foO1xnIYWC2El-WybHbcykbJRH346Q73zkSgno57NmVcYKUzH-7gnaNmrWvCGziQjQfn3TRLaKYlEVMlQ4TEyl3dWx_iFdkUBB6SnmISh39QqZxSwdWZLSxHw7yg-oCyA-Uff7f69j5ChewQo5gPix3CEjSAAe9GrJMYQ5YOsE3GMGfyIcBu6ETB35lgOh0a_3CwnyOnM6VH3V' }} 
            style={styles.avatar} 
          />
          <Text style={styles.headerTitle}>IskoolarShip</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#570000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Scholarship Matches</Text>
          <Text style={styles.pageSubtitle}>Personalized recommendations based on your profile compatibility.</Text>
        </View>

        <View style={styles.cardsContainer}>
          <ScholarshipCard 
            title="DOST-SEI Merit Scholarship"
            type="Government"
            match="92% Match"
            amount="₱40,000 / yr"
            icon="account-balance"
          />
          <ScholarshipCard 
            title="Ayala Foundation Grant"
            type="Private"
            match="88% Match"
            amount="₱50,000 / yr"
            icon="domain"
          />
          <ScholarshipCard 
            title="University Alumni Fund"
            type="Institutional"
            match="75% Match"
            amount="₱30,000 / yr"
            icon="school"
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2bfb9',
    backgroundColor: '#ffffff',
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
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b1c30',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#5a413d',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#e5eeff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 4,
    flexShrink: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d3e4fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#5a413d',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdc425',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5a4300',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    marginTop: 8,
  },
  footerLabel: {
    fontSize: 12,
    color: '#5a413d',
    marginBottom: 4,
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#570000',
  },
});
