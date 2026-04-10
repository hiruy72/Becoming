import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import { theme } from '../theme/theme';
import IntroStack from './IntroStack';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
  },
};

export default function RootNavigator() {
  const { hasSeenIntro, isAuthenticated, hasCompletedOnboarding } = useStore();

  return (
    <NavigationContainer theme={AppTheme}>
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
