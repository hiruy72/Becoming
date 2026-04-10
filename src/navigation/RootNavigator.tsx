import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import IntroStack from './IntroStack';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { hasSeenIntro, isAuthenticated, hasCompletedOnboarding } = useStore();

  return (
    <NavigationContainer>
      {!hasSeenIntro ? (
        <IntroStack />
      ) : !isAuthenticated ? (
        <AuthStack />
      ) : !hasCompletedOnboarding ? (
        <OnboardingStack />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
