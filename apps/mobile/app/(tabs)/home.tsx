import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../src/context/ProfileContext';
import { fetchCatalog } from '../../src/api/catalog';
import type { Scholarship, StudentProfile, Gender, Strand, Region, IncomeBracket, CatalogResponse } from '@iskoolarship/types';
import { filterScholarships, compatibilityScoring, optimizeApplication } from '@iskoolarship/algorithms';
import { useRouter } from 'expo-router';

// Helper icon picker
const getProviderIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
  if (type === 'government') return 'account-balance';
  if (type === 'school') return 'school';
  if (type === 'ngo') return 'volunteer-activism';
  return 'domain';
};

// Format currency
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useProfile();
  
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedResults, setMatchedResults] = useState<{ scholarship: Scholarship; score: number }[]>([]);

  useEffect(() => {
    const loadAndMatch = async () => {
      try {
        setLoading(true);
        // 1. Fetch live backend catalog
        const fetchedCatalog = await fetchCatalog();
        setCatalog(fetchedCatalog);
        
        if (!profile) {
          setLoading(false);
          return;
        }

        // 2. Map ProfileData (from onboarding) to StudentProfile (for algorithm)
        const availableDocKeys = Object.entries(profile.documents)
          .filter(([_, hasIt]) => hasIt)
          .map(([key, _]) => key);

        const availableDocIds = fetchedCatalog.documents
          .filter(d => availableDocKeys.includes(d.key))
          .map(d => d.id);

        const studentProfile: StudentProfile = {
          gpa: parseFloat(profile.gpa) || 2.0,
          strand: (profile.strand as Strand) || "All",
          region: (profile.region as Region) || "All",
          incomeBracket: (parseInt(profile.income) as IncomeBracket) || 3,
          gender: (profile.gender as Gender) || "Any",
          targetCourse: "All",
          yearLevel: "All",
          availableHours: 40,
          availableDocumentKeys: availableDocIds
        };

        // 3. Algorithm Step 1: Strict Filtering
        const eligible = fetchedCatalog.scholarships.filter(s => filterScholarships(studentProfile, s));

        // 4. Algorithm Step 2: Optimization / Selection 
        const optimized = optimizeApplication(studentProfile, eligible);

        // 5. Algorithm Step 3: Compatibility Scoring
        const scored = optimized.map(s => {
          const requiredDocs = fetchedCatalog.scholarshipRequiredDocuments.filter(d => d.scholarshipId === s.id);
          const score = compatibilityScoring(studentProfile, s, requiredDocs);
          return { scholarship: s, score };
        });

        // Simple default UI sort: highest score first
        scored.sort((a, b) => b.score - a.score);
        
        setMatchedResults(scored);
        
      } catch (e: any) {
        setError(e.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAndMatch();
  }, [profile]);

  if (!profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#570000" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNCIzZf1adplfDP5niAQ92wMKdvOyoxvg21XzWKV_VyfHv8AQQLllgDdICBCksaZ-CEE3bNICBqX9mLVfGUqAlPEGpeihGsYv_fwj_cFwjpYbrNo6KJR9wktMdIAzUte-IsEdiunZQyidFoOtONo1hvmwjrE6A9NF2neg0jO_iuytAXaxRhGWUgfgxLbsVWAcqSnmvQygP4cV-A0LlJDU5npkUqaUdxdGCVttTUUoL4BQgM0OgxNRLKTF3sXqZp-dEtXC07Aa6Dv65' }} 
            style={styles.avatar} 
          />
          <Text style={styles.headerTitle}>IskoolarShip</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#570000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, {profile.nickname}!</Text>
          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>CURRENT GPA</Text>
              <Text style={styles.metricValue}>{profile.gpa}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>STRAND</Text>
              <Text style={styles.metricValue}>{profile.strand}</Text>
            </View>
          </View>
        </View>

        {/* Filter Summary */}
        <View style={styles.filterSummary}>
          <View style={styles.filterLeft}>
            <MaterialIcons name="filter-list" size={20} color="#1e263a" />
            <Text style={styles.filterText}>
              <Text style={{fontWeight: '700'}}>{matchedResults.length}</Text> scholarships matched based on your profile.
            </Text>
          </View>
          <View style={styles.badgeOptimized}>
            <Text style={styles.badgeOptimizedText}>Optimized</Text>
          </View>
        </View>

        {/* Scholarship List Heading */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>Top Match Recommendations</Text>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/matches')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Status Messages */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#570000" />
            <Text style={styles.statusText}>Analyzing catalog details...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="error-outline" size={48} color="#e53e3e" />
            <Text style={styles.statusText}>{error}</Text>
          </View>
        ) : matchedResults.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="search-off" size={48} color="#718096" />
            <Text style={styles.statusText}>No matching scholarships found for your profile parameters.</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {matchedResults.slice(0, 3).map((result) => (
              <TouchableOpacity 
                key={result.scholarship.id}
                style={styles.card} 
                activeOpacity={0.75}
                onPress={() => router.replace('/(tabs)/matches')}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    {/* Icon Container */}
                    <View style={styles.iconContainer}>
                      <MaterialIcons name={getProviderIcon(result.scholarship.providerType)} size={24} color="#570000" />
                    </View>
                    
                    {/* Title and Provider */}
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{result.scholarship.name}</Text>
                      <Text style={styles.cardSubtitle} numberOfLines={1}>{result.scholarship.provider}</Text>
                    </View>
                  </View>

                  {/* Match Score Badge */}
                  <View style={[
                    styles.matchBadge, 
                    result.score >= 90 ? styles.matchBadgeHigh : styles.matchBadgeMedium
                  ]}>
                    {result.score >= 90 && (
                      <MaterialIcons name="local-fire-department" size={14} color="#6d5200" />
                    )}
                    <Text style={[
                      styles.matchText,
                      result.score >= 90 ? styles.matchTextHigh : styles.matchTextMedium
                    ]}>{result.score}% Match</Text>
                  </View>
                </View>

                {/* Card Stats Grid */}
                <View style={styles.cardStatsGrid}>
                  <View style={styles.statBox}>
                    <View style={styles.statBoxHeader}>
                      <MaterialIcons name="payments" size={16} color="#5a413d" />
                      <Text style={styles.statBoxLabel}>Amount</Text>
                    </View>
                    <Text style={styles.statBoxValue}>{formatMoney(result.scholarship.estimatedTotalValuePhp)}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <View style={styles.statBoxHeader}>
                      <MaterialIcons name="schedule" size={16} color="#5a413d" />
                      <Text style={styles.statBoxLabel}>Est. Effort</Text>
                    </View>
                    <Text style={styles.statBoxValue}>{result.scholarship.estimatedEffortHours} hrs</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    gap: 16,
  },
  welcomeSection: {
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#eff4ff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2bfb9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5a413d',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#570000',
  },
  filterSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dae2fd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bec6e0',
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
    gap: 8,
  },
  filterText: {
    fontSize: 13,
    color: '#131b2e',
    lineHeight: 18,
    flexShrink: 1,
  },
  badgeOptimized: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  badgeOptimizedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#570000',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b1c30',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#570000',
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 16,
    fontSize: 14,
    color: '#5a413d',
    textAlign: 'center',
  },
  cardsContainer: {
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
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#5a413d',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  matchBadgeHigh: {
    backgroundColor: '#fdc425',
    borderColor: '#f7be1d',
  },
  matchBadgeMedium: {
    backgroundColor: '#eff4ff',
    borderColor: '#e2bfb9',
  },
  matchText: {
    fontSize: 11,
    fontWeight: '700',
  },
  matchTextHigh: {
    color: '#6d5200',
  },
  matchTextMedium: {
    color: '#5a413d',
  },
  cardStatsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2bfb9',
    paddingTop: 16,
    gap: 16,
  },
  statBox: {
    flex: 1,
  },
  statBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#5a413d',
    fontWeight: '500',
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#570000',
  },
});
