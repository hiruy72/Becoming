import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';

const PRESETS = [
  'Elite Software Engineer',
  'Top Student',
  'Professional Athlete',
  'Financially Free'
];

export default function IdentitySetupScreen({ navigation }: any) {
  const { updateUserField } = useStore();
  const [identity, setIdentity] = useState('');
  const [goals, setGoals] = useState('');
  const [habits, setHabits] = useState('');

  const handleNext = () => {
    updateUserField({
      chosenIdentity: identity,
      goals: goals.split(',').map(g => g.trim()),
      habits: habits.split(',').map(h => h.trim())
    });
    navigation.navigate('ImageUpload');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Who do you want to become?</Text>
        <Text style={styles.subtitle}>Define your ultimate future self.</Text>

        <View style={styles.presets}>
          {PRESETS.map((preset, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[
                styles.presetChip,
                identity === preset && styles.presetChipActive
              ]}
              onPress={() => setIdentity(preset)}
            >
              <Text style={[
                styles.presetChipText,
                identity === preset && styles.presetChipTextActive
              ]}>{preset}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput 
          style={styles.input}
          placeholder="Or type a custom identity..."
          placeholderTextColor={theme.colors.text}
          value={identity}
          onChangeText={setIdentity}
        />

        <Text style={styles.label}>What are your main goals? (comma separated)</Text>
        <TextInput 
          style={styles.textArea}
          placeholder="e.g. Build a startup, Run a marathon"
          placeholderTextColor={theme.colors.text}
          multiline
          value={goals}
          onChangeText={setGoals}
        />

        <Text style={styles.label}>What are your current habits/weaknesses?</Text>
        <TextInput 
          style={styles.textArea}
          placeholder="e.g. Doomscrolling, Procrastination"
          placeholderTextColor={theme.colors.text}
          multiline
          value={habits}
          onChangeText={setHabits}
        />

        <TouchableOpacity 
          style={[styles.button, !identity && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={!identity}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
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
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  presetChip: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  presetChipActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.primary,
  },
  presetChipText: {
    color: theme.colors.textLight,
  },
  presetChipTextActive: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  label: {
    ...theme.typography.h3,
    fontSize: 16,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    width: '100%',
    height: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    color: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: theme.colors.primary,
    height: 55,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.surface,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
