import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { isAuthenticated, hasCompletedOnboarding } = useStore();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !hasCompletedOnboarding ? (
        <OnboardingStack />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
