import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { setAuthenticated, setUser } = useStore();

  const handleSignup = () => {
    // Typical Flow: Create Firebase Auth user, then navigate
    setUser({
      uid: Math.random().toString(),
      name,
      chosenIdentity: '',
      goals: [],
      habits: [],
      xp: 0,
      streak: 0,
    });
    setAuthenticated(true);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Join Future You</Text>
        <Text style={styles.subtitle}>Begin your transformative journey.</Text>

        <TextInput 
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor={theme.colors.text}
          value={name}
          onChangeText={setName}
        />
        
        <TextInput 
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.text}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        
        <TextInput 
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.text}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xxl,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: theme.colors.secondary,
    fontSize: 16,
  }
});
