import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { theme } from '../../theme/theme';
import { useStore } from '../../store/useStore';

const SLIDES = [
  {
    title: 'Meet Your Future',
    description: 'Talk directly to an older, highly successful version of yourself.',
    image: { uri: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=1000' }
  },
  {
    title: 'Architect Your Path',
    description: 'Every great building starts with a blueprint. Formulate weekly actionable habits.',
    image: { uri: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000' }
  },
  {
    title: 'Stay Accountable',
    description: 'Your future self will brutally honestly analyze your progress and tell you what went wrong.',
    image: { uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000' }
  },
  {
    title: 'Gamify Your Life',
    description: 'Level up your discipline, earn XP, and become the person you were meant to be.',
    image: { uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000' } 
  }
];

export default function IntroScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHasSeenIntro } = useStore();
  
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Trigger animation when index changes
  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setHasSeenIntro(true);
    }
  };

  const handleSkip = () => {
    setHasSeenIntro(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={SLIDES[currentIndex].image} 
            style={styles.heroImage}
            resizeMode="cover"
          />
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
      </Animated.View>

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
  imageContainer: {
    width: 280,
    height: 380,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    elevation: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroImage: {
    width: '100%',
    height: '100%',
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
    width: 25,
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
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
