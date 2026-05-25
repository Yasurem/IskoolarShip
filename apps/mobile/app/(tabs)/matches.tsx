import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../src/context/ProfileContext';
import { fetchCatalog } from '../../src/api/catalog';
import type { Scholarship, StudentProfile, Gender, Strand, Course, YearLevel, Region, IncomeBracket, CatalogResponse } from '@iskoolarship/types';
import { filterScholarships, compatibilityScoring, optimizeApplication } from '@iskoolarship/algorithms';

type CardProps = {
  scholarship: Scholarship;
  matchScore: number;
  catalog: CatalogResponse | null;
};

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

const ScholarshipCard = ({ scholarship, matchScore, catalog }: CardProps) => {
  const { profile, toggleTrack } = useProfile();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const isTracked = profile?.trackedIds?.includes(scholarship.id) || false;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>

          {/* Provider Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name={getProviderIcon(scholarship.providerType)} size={24} color="#570000" />
          </View>

          {/* Scholarship Name and Provider Type */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.cardTitle}>{scholarship.name}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{scholarship.providerType.charAt(0).toUpperCase() + scholarship.providerType.slice(1)}</Text>
            </View>
          </View>
        </View>

        {/* Match Score Badge */}
        <View style={styles.matchBadge}>
          <MaterialIcons name="verified" size={16} color="#5a4300" />
          <Text style={styles.matchText}>{matchScore}% Match</Text>
        </View>
      </View>

      {/* Unexpanded Footer */}
      {!isExpanded && (
        <View style={styles.cardFooter}>
          <Text style={styles.footerLabel}>Estimated Grant Value</Text>
          <Text style={styles.footerAmount}>{formatMoney(scholarship.estimatedTotalValuePhp)}</Text>
          
          <TouchableOpacity 
            style={[styles.trackButtonInline, isTracked && styles.trackedButtonInline]}
            onPress={() => toggleTrack(scholarship.id)}
          >
            <MaterialIcons name={isTracked ? "bookmark" : "bookmark-border"} size={18} color={isTracked ? "#ffffff" : "#570000"} />
            <Text style={[styles.trackButtonInlineText, isTracked && styles.trackedButtonInlineText]}>
              {isTracked ? "Remove from Tracklist" : "Add to Tracker"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Key Figures */}
          <View style={styles.keyFiguresGrid}>
            <View style={styles.figureBox}>
              <MaterialIcons name="payments" size={24} color="#570000" />
              <Text style={styles.figureLabel}>AMOUNT</Text>
              <Text style={styles.figureValue}>{formatMoney(scholarship.estimatedTotalValuePhp)}</Text>
            </View>
            <View style={styles.figureBox}>
              <MaterialIcons name="history" size={24} color="#570000" />
              <Text style={styles.figureLabel}>EST. EFFORT</Text>
              <Text style={styles.figureValue}>{scholarship.estimatedEffortHours} hrs</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}><MaterialIcons name="info" size={20} /> Description</Text>
            <Text style={styles.bodyText}>{scholarship.description || "No description provided."}</Text>
          </View>

          {/* Eligibility */}
          <View style={styles.sectionBg}>
            <Text style={styles.sectionTitle}>Eligibility Requirements</Text>
            {scholarship.minGpa && (
              <View style={styles.listItem}>
                <MaterialIcons name="check-circle" size={20} color="#fdc425" />
                <Text style={styles.bodyText}>GPA of at least {scholarship.minGpa}</Text>
              </View>
            )}
            {scholarship.allowedStrands && !scholarship.allowedStrands.includes('All') && (
              <View style={styles.listItem}>
                <MaterialIcons name="check-circle" size={20} color="#fdc425" />
                <Text style={styles.bodyText}>Strand: {scholarship.allowedStrands.join(', ')}</Text>
              </View>
            )}
          </View>

          {/* Required Documents */}
          {catalog && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Required Documents</Text>
              <View style={styles.docsContainer}>
                {catalog.scholarshipRequiredDocuments
                  .filter(d => d.scholarshipId === scholarship.id)
                  .map(req => {
                    const doc = catalog.documents.find(d => d.id === req.documentId);
                    if (!doc) return null;
                    
                    const userHasIt = profile?.documents ? profile.documents[doc.key as keyof typeof profile.documents] : false;
                    
                    return (
                      <View key={req.documentId} style={styles.docRow}>
                        <Text style={styles.bodyText}>{doc.name}</Text>
                        {userHasIt ? (
                          <View style={styles.badgeSuccess}>
                            <MaterialIcons name="cloud-done" size={14} color="#6d5200" />
                            <Text style={styles.badgeSuccessText}>UPLOADED</Text>
                          </View>
                        ) : (
                          <View style={styles.badgeError}>
                            <MaterialIcons name="error" size={14} color="#93000a" />
                            <Text style={styles.badgeErrorText}>MISSING</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
              </View>
            </View>
          )}

          {/* CTAs */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start Application</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, isTracked && styles.trackedButton]}
              onPress={() => toggleTrack(scholarship.id)}
            >
              <MaterialIcons name={isTracked ? "bookmark" : "bookmark-border"} size={20} color={isTracked ? "#ffffff" : "#570000"} />
              <Text style={[styles.secondaryButtonText, isTracked && styles.trackedButtonText]}>
                {isTracked ? "Remove from Tracklist" : "Add to Tracker"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Algorithm Routing
export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mapped list of matched scholarships with their scores
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
        // We use some default placeholders ("Any", "All") for fields the onboarding wizard didn't collect yet.
        const availableDocKeys = Object.entries(profile.documents)
          .filter(([_, hasIt]) => hasIt)
          .map(([key, _]) => key);

        // MAP: The frontend has "psa" but the database has UUIDs. We must map them!
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
        setError(e.message || "Failed to load scholarships.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAndMatch();
  }, [profile]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}

      {/* Header Avatar and Icons */}
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

      {/* Header Text */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Scholarship Matches</Text>
          <Text style={styles.pageSubtitle}>Personalized recommendations calculated locally on your device.</Text>
        </View>

        {/* Status Messages */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#570000" />
            <Text style={styles.statusText}>Running matching algorithms...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="error-outline" size={48} color="#e53e3e" />
            <Text style={styles.statusText}>{error}</Text>
          </View>
        ) : matchedResults.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="search-off" size={48} color="#718096" />
            <Text style={styles.statusText}>No scholarships matched your profile.</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {matchedResults.map((result) => (
              <ScholarshipCard 
                key={result.scholarship.id}
                scholarship={result.scholarship} 
                matchScore={result.score} 
                catalog={catalog}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Styles 
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
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4a5568',
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
    fontWeight: '500',
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
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    marginTop: 8,
  },
  keyFiguresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  figureBox: {
    flex: 1,
    backgroundColor: '#eff4ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  figureLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5a413d',
    marginTop: 8,
    marginBottom: 4,
  },
  figureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#570000',
  },
  section: {
    marginBottom: 16,
  },
  sectionBg: {
    backgroundColor: '#eff4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#570000',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 14,
    color: '#0b1c30',
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  docsContainer: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2bfb9',
    overflow: 'hidden',
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2bfb9',
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdc425',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeSuccessText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6d5200',
  },
  badgeError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffdad6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeErrorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#93000a',
  },
  ctaContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#570000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#570000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#570000',
    fontSize: 14,
    fontWeight: '600',
  },
  trackedButton: {
    backgroundColor: '#570000',
  },
  trackedButtonText: {
    color: '#ffffff',
  },
  trackButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#570000',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  trackButtonInlineText: {
    color: '#570000',
    fontSize: 14,
    fontWeight: '600',
  },
  trackedButtonInline: {
    backgroundColor: '#570000',
  },
  trackedButtonInlineText: {
    color: '#ffffff',
  },
});
