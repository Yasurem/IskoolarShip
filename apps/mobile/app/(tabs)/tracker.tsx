import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../src/context/ProfileContext';
import { fetchCatalog } from '../../src/api/catalog';
import type { Scholarship, CatalogResponse } from '@iskoolarship/types';
import { useRouter } from 'expo-router';

// Helper icon picker
const getProviderIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
  if (type === 'government') return 'account-balance';
  if (type === 'school') return 'school';
  if (type === 'ngo') return 'volunteer-activism';
  return 'domain';
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

type CardProps = {
  scholarship: Scholarship;
  catalog: CatalogResponse | null;
};

const TrackerCard = ({ scholarship, catalog }: CardProps) => {
  const { profile, toggleTrack } = useProfile();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const allReqs = catalog ? catalog.scholarshipRequiredDocuments.filter(d => d.scholarshipId === scholarship.id) : [];
  const visibleReqs = isExpanded ? allReqs : allReqs.slice(0, 3);
  const hiddenCount = allReqs.length - visibleReqs.length;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
      {/* Header Area */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={getProviderIcon(scholarship.providerType)} size={24} color="#570000" />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.cardTitle}>{scholarship.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{scholarship.providerType.charAt(0).toUpperCase() + scholarship.providerType.slice(1)}</Text>
            </View>
          </View>
        </View>
        <MaterialIcons name={isExpanded ? "expand-less" : "expand-more"} size={24} color="#5a413d" />
      </View>

      {/* Checklist (Always visible, but truncated when unexpanded) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        <View style={styles.docsContainer}>
          {visibleReqs.map(req => {
            const doc = catalog?.documents.find(d => d.id === req.documentId);
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
          {!isExpanded && hiddenCount > 0 && (
            <View style={styles.docRowCentered}>
              <Text style={styles.subText}>and {hiddenCount} more requirement(s)...</Text>
            </View>
          )}
          {allReqs.length === 0 && (
            <View style={styles.docRowCentered}>
              <Text style={styles.subText}>No specific documents required.</Text>
            </View>
          )}
        </View>
      </View>

      {/* Unexpanded Action: Remove Button */}
      {!isExpanded && (
        <TouchableOpacity 
          style={styles.removeButtonInline}
          onPress={() => toggleTrack(scholarship.id)}
        >
          <MaterialIcons name="bookmark-remove" size={20} color="#93000a" />
          <Text style={styles.removeButtonInlineText}>Remove from Tracker</Text>
        </TouchableOpacity>
      )}

      {/* Expanded Extra Details */}
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

          {/* CTAs */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start Application</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => toggleTrack(scholarship.id)}
            >
              <MaterialIcons name="bookmark-remove" size={20} color="#93000a" />
              <Text style={styles.removeButtonText}>Remove from Tracklist</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function TrackerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useProfile();
  
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const fetchedCatalog = await fetchCatalog();
        setCatalog(fetchedCatalog);
      } catch (e: any) {
        setError(e.message || "Failed to load catalog.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCatalog();
  }, []);

  const trackedScholarships = catalog 
    ? catalog.scholarships.filter(s => profile?.trackedIds?.includes(s.id))
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="assignment-turned-in" size={28} color="#570000" style={{marginRight: 8}} />
          <Text style={styles.headerTitle}>Saved Tracker</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#570000" />
            <Text style={styles.statusText}>Loading your tracker...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="error-outline" size={48} color="#e53e3e" />
            <Text style={styles.statusText}>{error}</Text>
          </View>
        ) : trackedScholarships.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={styles.emptyCircle}>
              <MaterialIcons name="bookmark-add" size={48} color="#e2bfb9" />
            </View>
            <Text style={styles.pageTitle}>No Saved Scholarships</Text>
            <Text style={styles.statusText}>Start your journey by exploring scholarships that match your profile. Save them here to track your progress.</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => router.replace('/(tabs)/matches')}>
              <Text style={styles.exploreButtonText}>Explore Recommendations</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            <Text style={styles.pageSubtitle}>You are tracking {trackedScholarships.length} scholarship(s).</Text>
            {trackedScholarships.map(scholarship => (
              <TrackerCard 
                key={scholarship.id}
                scholarship={scholarship}
                catalog={catalog}
              />
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
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dce9ff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0b1c30',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#5a413d',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#5a413d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#570000',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#570000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2bfb9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 4,
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
  section: {
    marginBottom: 12,
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
    fontSize: 14,
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
  subText: {
    fontSize: 12,
    color: '#5a413d',
    fontStyle: 'italic',
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
  docRowCentered: {
    alignItems: 'center',
    padding: 10,
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
  removeButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 4,
    backgroundColor: '#ffdad6',
    borderRadius: 8,
  },
  removeButtonInlineText: {
    color: '#93000a',
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    marginTop: 4,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
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
    borderColor: '#93000a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
  },
  removeButtonText: {
    color: '#93000a',
    fontSize: 14,
    fontWeight: '600',
  }
});
