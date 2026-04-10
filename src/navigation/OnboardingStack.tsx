import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IdentitySetupScreen from '../screens/onboarding/IdentitySetupScreen';
import ImageUploadScreen from '../screens/onboarding/ImageUploadScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IdentitySetup" component={IdentitySetupScreen} />
      <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
    </Stack.Navigator>
  );
}
