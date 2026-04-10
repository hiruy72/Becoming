import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

export default function ImageUploadScreen() {
  const { setOnboardingComplete } = useStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return;
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    }

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const processImage = async () => {
    setIsProcessing(true);
    // TODO: Upload to Firebase Storage
    // TODO: Call Replicate API for aging
    // Simulate delay
    setTimeout(() => {
      setIsProcessing(false);
      setOnboardingComplete(true);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Visualize Your Future</Text>
        <Text style={styles.subtitle}>Upload a selfie. Our AI will generate your successful, older self to talk to.</Text>

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <ImageIcon color={theme.colors.text} size={48} />
            </View>
          )}
        </View>

        {!isProcessing ? (
          <View style={styles.row}>
            <TouchableOpacity style={styles.iconButton} onPress={() => pickImage(true)}>
              <Camera color={theme.colors.textLight} size={24} />
              <Text style={styles.iconText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => pickImage(false)}>
              <ImageIcon color={theme.colors.textLight} size={24} />
              <Text style={styles.iconText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.processing}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.processingText}>Consulting the future...</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, (!imageUri || isProcessing) && styles.buttonDisabled]} 
          onPress={processImage}
          disabled={!imageUri || isProcessing}
        >
          <Text style={styles.buttonText}>Generate Future You</Text>
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
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
    width: '100%',
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  iconButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconText: {
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
  processing: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  processingText: {
    color: theme.colors.primary,
    marginTop: theme.spacing.m,
    fontSize: 16,
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
