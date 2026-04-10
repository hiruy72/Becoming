import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';
import { Target, Search, Smile, ShieldCheck, ArrowRight, Lock } from 'lucide-react-native';

const PRESETS = [
  'Elite Software Engineer',
  'Master Investor',
  'Pro Athlete',
  'Creative Director',
  'Impact Teacher'
];

export default function IdentitySetupScreen({ navigation }: any) {
  const { updateUserField } = useStore();
  const [identity, setIdentity] = useState('');
  const [goals, setGoals] = useState('');
  const [habits, setHabits] = useState('');

  const handleNext = () => {
    updateUserField({
      chosenIdentity: identity,
      goals: goals.split(',').map(g => g.trim()).filter(Boolean),
      habits: habits.split(',').map(h => h.trim()).filter(Boolean)
    });
    navigation.navigate('ImageUpload');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.tag}>
            <ShieldCheck color={theme.colors.success} size={14} />
            <Text style={styles.tagText}>End-to-End Encrypted</Text>
          </View>
          <Text style={styles.title}>Your Future Profile</Text>
          <Text style={styles.subtitle}>Our AI needs these details to construct the most accurate version of your future self.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            <Text style={styles.sectionLabel}>Dream Identity</Text>
          </View>
          <Text style={styles.sectionDescription}>Who will you be in 10 years?</Text>
          
          <View style={styles.presets}>
            {PRESETS.map((preset, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.presetChip, identity === preset && styles.presetActive]}
                onPress={() => setIdentity(preset)}
              >
                <Text style={[styles.presetText, identity === preset && styles.presetActiveText]}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput 
            style={styles.input}
            placeholder="Or type a custom identity..."
            placeholderTextColor={theme.colors.textMuted}
            value={identity}
            onChangeText={setIdentity}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
            <Text style={styles.sectionLabel}>Main Missions</Text>
          </View>
          <Text style={styles.sectionDescription}>Comma separated (e.g. Build a company, buy a home)</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="Focus on the big milestones..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            value={goals}
            onChangeText={setGoals}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.error }]} />
            <Text style={styles.sectionLabel}>Growth Limits</Text>
          </View>
          <Text style={styles.sectionDescription}>Current habits or weaknesses to defeat</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="Procrastination, poor sleep, distractions..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            value={habits}
            onChangeText={setHabits}
          />
        </View>

        {/* Security / Privacy Badge */}
        <View style={styles.securityBox}>
          <View style={styles.securityIcon}>
            <Lock color={theme.colors.textSecondary} size={16} />
          </View>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Your data is safe & private</Text>
            <Text style={styles.securitySub}>We use industry-standard encryption to secure your identity. Nothing is shared with third parties.</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, !identity && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={!identity}
        >
          <Text style={styles.buttonText}>Review your Identity</Text>
          <ArrowRight color="#fff" size={20} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 24, paddingBottom: 40 },
  
  header: { marginBottom: 32 },
  tag: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: theme.colors.successLight, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 16
  },
  tagText: { fontSize: 11, fontWeight: '700', color: theme.colors.success, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 34, fontWeight: '800', color: theme.colors.text, marginBottom: 10, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, lineHeight: 24 },

  section: { 
    backgroundColor: theme.colors.surface, borderRadius: 24, padding: 24, marginBottom: 20, 
    ...theme.shadow.soft, borderWidth: 1, borderColor: theme.colors.borderLight 
  },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  sectionDescription: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 16 },

  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  presetChip: { 
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, 
    backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border 
  },
  presetActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  presetText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '600' },
  presetActiveText: { color: '#fff' },

  input: { 
    width: '100%', height: 54, backgroundColor: theme.colors.background, borderRadius: 14, 
    paddingHorizontal: 16, color: theme.colors.text, fontSize: 15, borderWidth: 1, borderColor: theme.colors.border 
  },
  textArea: { 
    width: '100%', height: 110, backgroundColor: theme.colors.background, borderRadius: 14, 
    paddingHorizontal: 16, paddingTop: 14, color: theme.colors.text, fontSize: 15, 
    borderWidth: 1, borderColor: theme.colors.border, textAlignVertical: 'top' 
  },

  securityBox: { 
    flexDirection: 'row', gap: 16, padding: 20, borderRadius: 20, 
    backgroundColor: 'rgba(26, 60, 64, 0.03)', marginBottom: 32,
    borderWidth: 1, borderColor: theme.colors.borderLight
  },
  securityIcon: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, 
    justifyContent: 'center', alignItems: 'center', ...theme.shadow.soft
  },
  securityContent: { flex: 1 },
  securityTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  securitySub: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 },

  button: { 
    backgroundColor: theme.colors.primary, height: 62, borderRadius: 18, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    ...theme.shadow.card 
  },
  buttonDisabled: { backgroundColor: theme.colors.border, shadowOpacity: 0 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
