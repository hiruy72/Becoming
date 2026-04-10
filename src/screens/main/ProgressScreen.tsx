import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../../theme/theme';
import { useStore } from '../../store/useStore';

export default function ProgressScreen() {
  const { user } = useStore();
  const alignmentPercentage = 42;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your Evolution</Text>
        <Text style={styles.subtitle}>Tracking your path to your future self.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Identity Alignment</Text>
          <Text style={styles.percentText}>{alignmentPercentage}%</Text>
          <Text style={styles.cardSubtitle}>You are 42% aligned with becoming a {user?.chosenIdentity || 'champion'}.</Text>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${alignmentPercentage}%` }]} />
          </View>
        </View>

        <View style={styles.rowStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Levels</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Streak</Text>
            <Text style={styles.statValue}>7 Days</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Analysis</Text>
          <Text style={styles.analysisText}>
            "You failed to limit doomscrolling to 30 mins last Tuesday. Accountability is everything. Try removing the app from your home screen this week." - Future You
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.l,
    alignItems: 'center',
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.textLight,
  },
  percentText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: theme.spacing.s,
  },
  cardSubtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  rowStats: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    ...theme.typography.caption,
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  analysisText: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    marginTop: theme.spacing.m,
    textAlign: 'center',
    lineHeight: 24,
  }
});
