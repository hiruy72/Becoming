import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from '../../theme/theme';
import { CheckCircle2, Circle } from 'lucide-react-native';

export default function PlanScreen() {
  const [tasks, setTasks] = useState<{ id: string, text: string, completed: boolean }[]>([
    { id: '1', text: 'Wake up at 5 AM', completed: false },
    { id: '2', text: '1 Hour coding practice', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const analyzePlan = () => {
    Alert.alert("Future Self Analysis", "Your plan looks solid, but 1 hour of coding isn't enough to reach 'Elite Software Engineer' in 3 years. Let's make it 2 hours.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Weekly Battle Plan</Text>
        <Text style={styles.subtitle}>Formulate your week. Submit for review.</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Add a new habit or task..."
            placeholderTextColor={theme.colors.text}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskList}>
          {tasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskItem}
              onPress={() => toggleTask(task.id)}
            >
              {task.completed ? (
                <CheckCircle2 color={theme.colors.success} size={24} />
              ) : (
                <Circle color={theme.colors.text} size={24} />
              )}
              <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                {task.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={analyzePlan}>
          <Text style={styles.buttonText}>Get Future Feedback</Text>
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
    gap: theme.spacing.s,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textLight,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.background,
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xxl,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  taskText: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.m,
    flex: 1,
  },
  taskTextCompleted: {
    color: theme.colors.text,
    textDecorationLine: 'line-through',
  },
  button: {
    backgroundColor: theme.colors.secondary,
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
