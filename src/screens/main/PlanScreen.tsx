import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useStore, DAYS_OF_WEEK, DayOfWeek, Task } from '../../store/useStore';
import { CheckCircle2, Circle, Plus, X, CalendarDays, Clock, Brain } from 'lucide-react-native';
import { getTaskInsight } from '../../services/ai';

export default function PlanScreen() {
  const { user, weeklyPlan, addTask, toggleTask, removeTask, updateTask } = useStore();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDay());
  const [newTask, setNewTask] = useState('');
  const [duration, setDuration] = useState('30');
  const [showInput, setShowInput] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  function getCurrentDay(): DayOfWeek {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    const taskObj: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      duration: parseInt(duration) || 30,
    };

    addTask(selectedDay, taskObj);
    setNewTask('');
    setDuration('30');
    setShowInput(false);

    // Call AI for insight and duration suggestion
    setIsAiLoading(true);
    const aiResponse = await getTaskInsight(taskObj.text, taskObj.duration!, user);
    updateTask(selectedDay, taskObj.id, {
      insight: aiResponse.insight,
      suggestedDuration: aiResponse.suggestedDuration
    });
    setIsAiLoading(false);
  };

  const tasks = weeklyPlan[selectedDay] || [];
  const completedCount = tasks.filter(t => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Weekly Plan</Text>
            <Text style={styles.subtitle}>Plan with your future self's insight.</Text>
          </View>
          <View style={styles.headerIcon}>
            {isAiLoading ? <ActivityIndicator color={theme.colors.primary} size="small" /> : <Brain color={theme.colors.primary} size={22} />}
          </View>
        </View>

        {/* Day Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll} contentContainerStyle={styles.dayScrollContent}>
          {DAYS_OF_WEEK.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayPill, selectedDay === day && styles.dayPillActive]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayPillLabel, selectedDay === day && styles.dayPillLabelActive]}>{day.slice(0, 3)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Day List */}
        <View style={styles.dayCard}>
          <Text style={styles.dayCardTitle}>{selectedDay}</Text>
          
          {tasks.length === 0 ? (
            <View style={styles.emptyView}><Text style={styles.emptyText}>Empty schedule</Text></View>
          ) : (
            tasks.map(task => (
              <View key={task.id} style={styles.taskBlock}>
                <View style={styles.taskRow}>
                  <TouchableOpacity onPress={() => toggleTask(selectedDay, task.id)} style={styles.check}>
                    {task.completed ? <View style={styles.checkDone}><CheckCircle2 color="#fff" size={14} /></View> : <View style={styles.checkEmpty} />}
                  </TouchableOpacity>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskText, task.completed && styles.taskTextDone]}>{task.text}</Text>
                    <View style={styles.taskMeta}>
                      <Clock size={12} color={theme.colors.textMuted} />
                      <Text style={styles.taskMetaText}>{task.duration} mins</Text>
                      {task.suggestedDuration && task.suggestedDuration !== task.duration && (
                        <Text style={styles.suggestedText}>• Suggest: {task.suggestedDuration}m</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removeTask(selectedDay, task.id)}><X color={theme.colors.textMuted} size={16} /></TouchableOpacity>
                </View>
                {task.insight && (
                  <View style={styles.insightBox}>
                    <Brain size={12} color={theme.colors.primary} />
                    <Text style={styles.insightText}>"{task.insight}"</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Add Section */}
        {showInput ? (
          <View style={styles.addCard}>
            <TextInput style={styles.addInput} placeholder="What needs to be done?" value={newTask} onChangeText={setNewTask} />
            <View style={styles.durationInputRow}>
              <Clock size={16} color={theme.colors.textMuted} />
              <TextInput style={styles.durationInput} placeholder="Duration" value={duration} onChangeText={setDuration} keyboardType="numeric" />
              <Text style={styles.minsText}>minutes</Text>
            </View>
            <View style={styles.addActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowInput(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}><Text style={styles.addBtnText}>Add to {selectedDay}</Text></TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.floatingBtn} onPress={() => setShowInput(true)}>
            <Plus color="#fff" size={20} />
            <Text style={styles.floatingBtnText}>Plan Item</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
  headerIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.borderLight, justifyContent: 'center', alignItems: 'center' },

  dayScroll: { marginBottom: 24, marginHorizontal: -20 },
  dayScrollContent: { paddingHorizontal: 20, gap: 10 },
  dayPill: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, backgroundColor: theme.colors.surface, alignItems: 'center', minWidth: 64, ...theme.shadow.soft },
  dayPillActive: { backgroundColor: theme.colors.primary },
  dayPillLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  dayPillLabelActive: { color: '#fff' },

  dayCard: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large, padding: 20, marginBottom: 20, ...theme.shadow.card },
  dayCardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 },
  
  taskBlock: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight, paddingBottom: 16 },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  check: { width: 22, height: 22, marginTop: 2 },
  checkEmpty: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: theme.colors.border },
  checkDone: { width: 22, height: 22, borderRadius: 11, backgroundColor: theme.colors.success, justifyContent: 'center', alignItems: 'center' },
  taskInfo: { flex: 1 },
  taskText: { fontSize: 15, fontWeight: '600', color: theme.colors.text, lineHeight: 21 },
  taskTextDone: { color: theme.colors.textMuted, textDecorationLine: 'line-through' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  taskMetaText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  suggestedText: { fontSize: 11, color: theme.colors.primary, fontWeight: '700' },

  insightBox: { flexDirection: 'row', gap: 8, backgroundColor: theme.colors.background, padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  insightText: { flex: 1, fontSize: 12, fontStyle: 'italic', color: theme.colors.textSecondary },

  emptyView: { paddingVertical: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, color: theme.colors.textMuted },

  addCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, ...theme.shadow.card },
  addInput: { fontSize: 16, color: theme.colors.text, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 8 },
  durationInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  durationInput: { fontSize: 14, color: theme.colors.text, width: 40, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  minsText: { fontSize: 13, color: theme.colors.textMuted },
  addActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: 10 },
  cancelText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '600' },
  addBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  floatingBtn: { backgroundColor: theme.colors.accent, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, ...theme.shadow.card },
  floatingBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
