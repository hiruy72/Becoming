import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';

const SLIDES = [
  {
    title: 'Meet Your Future',
    description: 'Talk directly to an older, highly successful version of yourself.',
  },
  {
    title: 'Achieve Everything',
    description: 'Get deep, personalized advice based on your current habits and goals.',
  },
  {
    title: 'Gamify Your Life',
    description: 'Level up, earn XP, and become the person you were meant to be.',
  }
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('IdentitySetup');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('IdentitySetup')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.placeholderImage}>
          <Text style={{color: theme.colors.primary}}>Illustration / Image Here</Text>
        </View>

        <Text style={styles.title}>{SLIDES[currentIndex].title}</Text>
        <Text style={styles.description}>{SLIDES[currentIndex].description}</Text>

        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index && styles.activeDot
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? "Let's Begin" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    alignItems: 'flex-end',
    padding: theme.spacing.m,
  },
  skipText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  placeholderImage: {
    width: 250,
    height: 250,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.body,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 20,
  },
  footer: {
    padding: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 55,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
