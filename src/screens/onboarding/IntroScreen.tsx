import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Meet Your Future',
    description: 'Talk directly to an older, highly successful version of yourself.',
    image: require('../../../assets/logo.png'),
    isLocal: true
  },
  {
    title: 'Architect Your Path',
    description: 'Every great building starts with a blueprint. Formulate weekly actionable habits.',
    image: { uri: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000' }
  },
  {
    title: 'Stay Accountable',
    description: 'Your future self will provide brutally honest analysis of your progress.',
    image: { uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000' }
  },
  {
    title: 'Level Up Your Life',
    description: 'Build discipline, earn XP, and become the person you were meant to be.',
    image: { uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000' }
  }
];

export default function IntroScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHasSeenIntro } = useStore();
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const exitAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(15);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true })
    ]).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Animated.timing(exitAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setHasSeenIntro(true);
      });
    }
  };

  const backgroundColor = exitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.background, theme.colors.surface]
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.main, { opacity: exitAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => setHasSeenIntro(true)}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Animated.View style={[styles.slide, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={[styles.imageWrap, currentIndex === 0 && styles.logoBackground]}>
                <Image 
                  source={SLIDES[currentIndex].image} 
                  style={[styles.image, currentIndex === 0 && styles.logoImage]} 
                  resizeMode={currentIndex === 0 ? "contain" : "cover"}
                />
              </View>
              <Text style={styles.title}>{SLIDES[currentIndex].title}</Text>
              <Text style={styles.description}>{SLIDES[currentIndex].description}</Text>
            </Animated.View>

            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View key={i} style={[styles.dot, currentIndex === i && styles.dotActive]} />
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
              <Text style={styles.buttonText}>
                {currentIndex === SLIDES.length - 1 ? "Start Transformation" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  main: { flex: 1 },
  topSection: { padding: 20, alignItems: 'flex-end' },
  skipText: { fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  slide: { alignItems: 'center', width: '100%' },
  imageWrap: {
    width: width * 0.8, height: width * 0.9, borderRadius: 28, overflow: 'hidden', marginBottom: 32,
    backgroundColor: theme.colors.surface, ...theme.shadow.card,
    borderWidth: 1, borderColor: theme.colors.borderLight
  },
  // Adjusted logo layout for a more balanced "stunning" feel
  logoBackground: { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 60 },
  image: { width: '100%', height: '100%' },
  logoImage: { width: '100%', height: '100%' }, // Uses container padding (60) now for sizing
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 },
  description: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', marginTop: 40, gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border },
  dotActive: { width: 28, backgroundColor: theme.colors.primary },
  footer: { padding: 24, paddingBottom: 40 },
  button: {
    backgroundColor: theme.colors.accent, height: 62, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', ...theme.shadow.card,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
