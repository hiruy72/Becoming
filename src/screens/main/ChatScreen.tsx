import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useStore } from '../../store/useStore';
import { theme } from '../../theme/theme';
import { Send } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'future-self';
}

export default function ChatScreen() {
  const { user } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Initial welcome message from Future Self
    setMessages([
      {
        id: '1',
        text: `Hey past me. I've been waiting for you. I know exactly what you're trying to achieve by becoming a ${user?.chosenIdentity || 'better person'}. Let's get to work. What's on your mind today?`,
        sender: 'future-self',
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Step 6: Call OpenAI API using fetch
      const prompt = `
        You are the future version of this user: ${user?.name || 'User'}. 
        You are 10 years older, highly successful, and have fully achieved their chosen identity: ${user?.chosenIdentity}.
        User goals: ${user?.goals?.join(', ')}. Habits/Weaknesses: ${user?.habits?.join(', ')}.
        Speak with profound clarity, experience, wisdom, and honesty. You guide them, correct them when needed with tough love, motivate them, and provide realistic advice. Keep responses concise as text messages.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt },
            // Feed a few past messages for context
            ...messages.slice(-5).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: newUserMsg.text }
          ],
          max_tokens: 150,
        })
      });

      const data = await response.json();
      const replyBody = data.choices?.[0]?.message?.content?.trim() || "Let's keep pushing forward.";

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: replyBody,
        sender: 'future-self'
      }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now, but stay focused.",
        sender: 'future-self'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.futureBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.futureMessageText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Future You</Text>
        <Text style={styles.headerSubtitle}>Online</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Future You is typing...</Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask your future self..."
            placeholderTextColor={theme.colors.text}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send color={theme.colors.background} size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  headerSubtitle: {
    ...theme.typography.caption,
  },
  chatList: {
    padding: theme.spacing.m,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.m,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 0,
  },
  futureBubble: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    ...theme.typography.body,
  },
  userMessageText: {
    color: theme.colors.background,
  },
  futureMessageText: {
    color: theme.colors.textLight,
  },
  typingIndicator: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.s,
  },
  typingText: {
    ...theme.typography.caption,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    color: theme.colors.textLight,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.large,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.m,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.text,
  }
});
