import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { setAuthenticated, setUser } = useStore();

  const handleSignup = () => {
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
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000' }} 
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.overlay}>
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
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={name}
              onChangeText={setName}
            />
            
            <TextInput 
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 12, 16, 0.85)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.s,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xxl,
    color: '#E0E0E0',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: 'rgba(31, 40, 51, 0.85)',
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(69, 162, 158, 0.3)',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  }
});
