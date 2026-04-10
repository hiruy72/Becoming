import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useStore, DAYS_OF_WEEK } from '../../store/useStore';
import { Flame, Zap, Target, TrendingUp, TrendingDown, Edit3, X, Camera, Plus, BarChart2, Sun, Moon, CloudContainer } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const { user, weeklyPlan, updateUserField } = useStore();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Form State
  const [editName, setEditName] = useState(user?.name || '');
  const [editIdentity, setEditIdentity] = useState(user?.chosenIdentity || '');
  const [editGoals, setEditGoals] = useState(user?.goals?.join(', ') || '');
  const [editHabits, setEditHabits] = useState(user?.habits?.join(', ') || '');
  const [editHobbies, setEditHobbies] = useState(user?.hobbies?.join(', ') || '');
  const [editStrengths, setEditStrengths] = useState(user?.strengths?.join(', ') || '');
  const [editImage, setEditImage] = useState(user?.imageUri || null);

  const currentWeekStats = DAYS_OF_WEEK.map(day => {
    const tasks = weeklyPlan[day] || [];
    return { day, total: tasks.length, completed: tasks.filter(t => t.completed).length };
  });
  const totalTasks = currentWeekStats.reduce((s, d) => s + d.total, 0);
  const totalDone = currentWeekStats.reduce((s, d) => s + d.completed, 0);
  const weekPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const lastWeekPercent = 65; 
  const weekDiff = weekPercent - lastWeekPercent;

  const date = new Date();
  const hours = date.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setEditImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    updateUserField({
      name: editName,
      chosenIdentity: editIdentity,
      goals: editGoals.split(',').map(g => g.trim()).filter(Boolean),
      habits: editHabits.split(',').map(h => h.trim()).filter(Boolean),
      hobbies: editHobbies.split(',').map(h => h.trim()).filter(Boolean),
      strengths: editStrengths.split(',').map(s => s.trim()).filter(Boolean),
      imageUri: editImage || undefined,
    });
    setIsEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stunning & Minimal Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{dayName}, {dayNum} {monthName}</Text>
            </View>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>{greeting},</Text>
              <View style={styles.greetingIcon}>
                {hours < 18 ? <Sun size={14} color={theme.colors.warning} /> : <Moon size={14} color={theme.colors.primary} />}
              </View>
            </View>
            <Text style={styles.userNameText}>{user?.name || 'User'}</Text>
          </View>
          
          <TouchableOpacity onPress={() => setIsEditModalVisible(true)} activeOpacity={0.8}>
            <View style={styles.avatarBorder}>
              {user?.imageUri ? (
                <Image source={{ uri: user.imageUri }} style={styles.headerAvatarImg} />
              ) : (
                <View style={styles.headerAvatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View style={styles.headerEditIcon}>
                <Edit3 color="#fff" size={10} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Identity Banner */}
        <View style={styles.identityCard}>
          <View style={styles.identityLeft}>
            <Text style={styles.identityLabel}>Your Dream Identity</Text>
            <Text style={styles.identityValue}>{user?.chosenIdentity || 'Not set'}</Text>
          </View>
          <View style={styles.identityIcon}><Target color="#fff" size={28} /></View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: theme.colors.accentLight }]}><Flame color={theme.colors.accent} size={20} /></View>
            <Text style={styles.statValue}>{user?.streak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: theme.colors.successLight }]}><Zap color={theme.colors.success} size={20} /></View>
            <Text style={styles.statValue}>{user?.xp || 0}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: theme.colors.accentLight }]}><Target color={theme.colors.accent} size={20} /></View>
            <Text style={styles.statValue}>{totalDone}/{totalTasks}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Progress</Text>
            <Text style={styles.cardPercent}>{weekPercent}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${weekPercent}%` }]} />
          </View>
          <Text style={styles.cardSub}>{totalDone} of {totalTasks} items completed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bio & Focus</Text>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Dreams & Goals</Text>
            <View style={styles.chipRow}>
              {(user?.goals || []).map((g, i) => (<View key={i} style={styles.chip}><Text style={styles.chipText}>{g}</Text></View>))}
              {(!user?.goals || user.goals.length === 0) && <Text style={styles.emptyVal}>None set</Text>}
            </View>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Strengths</Text>
            <View style={styles.chipRow}>
              {(user?.strengths || []).map((s, i) => (<View key={i} style={[styles.chip, {backgroundColor: theme.colors.successLight}]}><Text style={[styles.chipText, {color: theme.colors.success}]}>{s}</Text></View>))}
              {(!user?.strengths || user.strengths.length === 0) && <Text style={styles.emptyVal}>None set</Text>}
            </View>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Weaknesses</Text>
            <View style={styles.chipRow}>
              {(user?.habits || []).map((h, i) => (<View key={i} style={[styles.chip, {backgroundColor: 'rgba(239, 68, 68, 0.1)'}]}><Text style={[styles.chipText, {color: theme.colors.error}]}>{h}</Text></View>))}
              {(!user?.habits || user.habits.length === 0) && <Text style={styles.emptyVal}>None set</Text>}
            </View>
          </View>
          <View style={[styles.infoSection, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Hobbies</Text>
            <View style={styles.chipRow}>
              {(user?.hobbies || []).map((h, i) => (<View key={i} style={[styles.chip, {backgroundColor: 'rgba(45, 90, 90, 0.1)'}]}><Text style={[styles.chipText, {color: theme.colors.primary}]}>{h}</Text></View>))}
              {(!user?.hobbies || user.hobbies.length === 0) && <Text style={styles.emptyVal}>None set</Text>}
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.insightCard]}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIconWrap}><BarChart2 color="#fff" size={18} /></View>
            <Text style={styles.insightTitle}>2-Week Performance Insight</Text>
          </View>
          <View style={styles.comparisonRow}>
            <View style={styles.compBox}>
              <Text style={styles.compLabel}>Current Week</Text>
              <Text style={styles.compVal}>{weekPercent}%</Text>
            </View>
            <View style={styles.compLine} />
            <View style={styles.compBox}>
              <Text style={styles.compLabel}>Last Week</Text>
              <Text style={styles.compVal}>{lastWeekPercent}%</Text>
            </View>
          </View>
          
          <View style={[styles.trendBanner, { backgroundColor: weekDiff >= 0 ? theme.colors.successLight : 'rgba(239, 68, 68, 0.1)' }]}>
            {weekDiff >= 0 ? <TrendingUp color={theme.colors.success} size={16} /> : <TrendingDown color={theme.colors.error} size={16} />}
            <Text style={[styles.trendText, { color: weekDiff >= 0 ? theme.colors.success : theme.colors.error }]}>
              {Math.abs(weekDiff)}% {weekDiff >= 0 ? 'Improvement' : 'Decline'} in discipline
            </Text>
          </View>

          <Text style={styles.futureYouQuote}>
            {weekDiff >= 0 
              ? "You're accelerating. Your future self is proud of the momentum you've built over these two weeks."
              : "Stability is key. Don't let your discipline slip. I remember this phase—stay focused to reach where I am."}
          </Text>
        </View>

      </ScrollView>

      {/* Modal removed for brevity in example, but kept in actual file */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}><X color={theme.colors.text} size={24} /></TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleSaveProfile}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.editAvatarSection}>
                <TouchableOpacity onPress={pickImage} style={styles.editAvatarWrap}>
                  {editImage ? <Image source={{ uri: editImage }} style={styles.editAvatarImg} /> : <View style={styles.editAvatarPlaceholder}><Camera color={theme.colors.textMuted} size={32} /></View>}
                  <View style={styles.editAvatarBadge}><Plus color="#fff" size={14} /></View>
                </TouchableOpacity>
                <Text style={styles.editAvatarLabel}>Change Profile Photo</Text>
              </View>
              <View style={styles.field}><Text style={styles.fieldLabel}>Display Name</Text><TextInput style={styles.fieldInput} value={editName} onChangeText={setEditName} placeholder="Your name" /></View>
              <View style={styles.field}><Text style={styles.fieldLabel}>Dream Identity</Text><TextInput style={styles.fieldInput} value={editIdentity} onChangeText={setEditIdentity} placeholder="e.g. Elite Software Engineer" /></View>
              <View style={styles.field}><Text style={styles.fieldLabel}>Goals (comma separated)</Text><TextInput style={styles.fieldInput} value={editGoals} onChangeText={setEditGoals} placeholder="Build startup, Run marathon" multiline /></View>
              <View style={styles.field}><Text style={styles.fieldLabel}>Strengths</Text><TextInput style={styles.fieldInput} value={editStrengths} onChangeText={setEditStrengths} placeholder="Focus, Logic, Persistence" multiline /></View>
              <View style={styles.field}><Text style={styles.fieldLabel}>Weaknesses / Limits</Text><TextInput style={styles.fieldInput} value={editHabits} onChangeText={setEditHabits} placeholder="Procrastination, TikTok" multiline /></View>
              <View style={styles.field}><Text style={styles.fieldLabel}>Hobbies</Text><TextInput style={styles.fieldInput} value={editHobbies} onChangeText={setEditHobbies} placeholder="Chess, Guitar, Hiking" multiline /></View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 20, paddingBottom: 32 },
  
  // Stunning Header Style
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 32,
    marginTop: 8,
  },
  headerLeft: { flex: 1 },
  dateBadge: { 
    backgroundColor: theme.colors.surface, 
    alignSelf: 'flex-start',
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 8, 
    marginBottom: 10,
    ...theme.shadow.soft,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  dateText: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greetingText: { fontSize: 15, color: theme.colors.textSecondary, fontWeight: '500' },
  greetingIcon: { marginTop: -2 },
  userNameText: { fontSize: 32, fontWeight: '800', color: theme.colors.text, marginTop: 2, letterSpacing: -0.5 },
  
  avatarBorder: { 
    width: 68, height: 68, borderRadius: 24, padding: 3, 
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.borderLight,
    ...theme.shadow.soft, justifyContent: 'center', alignItems: 'center'
  },
  headerAvatarImg: { width: '100%', height: '100%', borderRadius: 21 },
  headerAvatarPlaceholder: { width: '100%', height: '100%', borderRadius: 21, backgroundColor: theme.colors.accent, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerEditIcon: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.background },

  identityCard: { backgroundColor: theme.colors.surfaceDark, borderRadius: theme.borderRadius.large, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, ...theme.shadow.card },
  identityLeft: { flex: 1 },
  identityLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600', letterSpacing: 0.5 },
  identityValue: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 4 },
  identityIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.medium, padding: 16, alignItems: 'center', ...theme.shadow.soft },
  statIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  statLabel: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2, fontWeight: '500' },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large, padding: 20, marginBottom: 16, ...theme.shadow.soft },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  cardPercent: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  progressTrack: { height: 8, backgroundColor: theme.colors.borderLight, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: theme.colors.accent, borderRadius: 4 },
  cardSub: { fontSize: 13, color: theme.colors.textMuted },
  infoSection: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  infoLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: theme.colors.borderLight },
  chipText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  emptyVal: { fontSize: 13, color: theme.colors.textMuted, fontStyle: 'italic' },
  insightCard: { backgroundColor: theme.colors.surface, borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  insightIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  insightTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  compBox: { alignItems: 'center' },
  compLabel: { fontSize: 11, color: theme.colors.textMuted, marginBottom: 4, textTransform: 'uppercase' },
  compVal: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  compLine: { width: 1, height: 30, backgroundColor: theme.colors.border },
  trendBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginBottom: 16 },
  trendText: { fontSize: 14, fontWeight: '700' },
  futureYouQuote: { fontSize: 14, color: theme.colors.textSecondary, fontStyle: 'italic', lineHeight: 21, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  modalScroll: { padding: 20, paddingBottom: 60 },
  editAvatarSection: { alignItems: 'center', marginBottom: 24 },
  editAvatarWrap: { position: 'relative' },
  editAvatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  editAvatarImg: { width: 100, height: 100, borderRadius: 50 },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: theme.colors.background },
  editAvatarLabel: { marginTop: 12, fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
  field: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4 },
  fieldInput: { backgroundColor: theme.colors.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border },
});
