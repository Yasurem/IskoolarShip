import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProfileData = {
  gpa: string;
  strand: string;
  region: string;
  income: string;
  documents: {
    psa: boolean;
    form138: boolean;
    itr: boolean;
    gmrc: boolean;
  };
  trackedIds?: string[];
};

type ProfileContextType = {
  hasOnboarded: boolean;
  isLoading: boolean;
  profile: ProfileData | null;
  completeOnboarding: (data: ProfileData) => Promise<void>;
  resetProfile: () => Promise<void>;
  toggleTrack: (scholarshipId: string) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@iskoolarship_profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
          setHasOnboarded(true);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const completeOnboarding = async (data: ProfileData) => {
    try {
      await AsyncStorage.setItem('@iskoolarship_profile', JSON.stringify(data));
      setProfile(data);
      setHasOnboarded(true);
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  const resetProfile = async () => {
    try {
      await AsyncStorage.removeItem('@iskoolarship_profile');
      setProfile(null);
      setHasOnboarded(false);
    } catch (e) {
      console.error('Failed to clear profile', e);
    }
  };

  const toggleTrack = async (scholarshipId: string) => {
    if (!profile) return;
    try {
      const currentTracked = profile.trackedIds || [];
      const isTracked = currentTracked.includes(scholarshipId);
      
      let newTracked: string[];
      if (isTracked) {
        newTracked = currentTracked.filter(id => id !== scholarshipId);
      } else {
        newTracked = [...currentTracked, scholarshipId];
      }

      const updatedProfile = { ...profile, trackedIds: newTracked };
      await AsyncStorage.setItem('@iskoolarship_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (e) {
      console.error('Failed to toggle track', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ hasOnboarded, isLoading, profile, completeOnboarding, resetProfile, toggleTrack }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
