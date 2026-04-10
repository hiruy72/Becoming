import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    // Simulate API logic
    setTimeout(() => {
      setIsProcessing(false);
      setOnboardingComplete(true);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Visualize Your Future</Text>
        <Text style={styles.subtitle}>Upload a selfie. Our AI will generate your successful, older self to guide you.</Text>

        <View style={styles.imageWrap}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <ImageIcon color={theme.colors.border} size={64} />
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
          )}
        </View>

        {!isProcessing ? (
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.optionBtn} onPress={() => pickImage(true)}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryLight }]}>
                <Camera color="#fff" size={24} />
              </View>
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={() => pickImage(false)}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.accent }]}>
                <ImageIcon color="#fff" size={24} />
              </View>
              <Text style={styles.optionText}>Library</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.processing}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.processingText}>Consulting your future self...</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.mainBtn, (!imageUri || isProcessing) && styles.mainBtnOff]} 
          onPress={processImage}
          disabled={!imageUri || isProcessing}
        >
          <Text style={styles.mainBtnText}>Generate My Future</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },

  imageWrap: {
    width: 240, height: 240, borderRadius: 120, backgroundColor: theme.colors.surface, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 40, ...theme.shadow.card,
    borderWidth: 4, borderColor: theme.colors.surface, overflow: 'hidden'
  },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { fontSize: 14, color: theme.colors.textMuted, marginTop: 12, fontWeight: '500' },

  btnRow: { flexDirection: 'row', gap: 16, width: '100%' },
  optionBtn: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, alignItems: 'center', ...theme.shadow.soft },
  iconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  optionText: { fontSize: 14, fontWeight: '700', color: theme.colors.text },

  processing: { alignItems: 'center', marginTop: 20 },
  processingText: { color: theme.colors.primary, marginTop: 16, fontSize: 16, fontWeight: '600' },

  footer: { padding: 24, paddingBottom: 40 },
  mainBtn: { backgroundColor: theme.colors.accent, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', ...theme.shadow.card },
  mainBtnOff: { backgroundColor: theme.colors.border, shadowOpacity: 0 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});
