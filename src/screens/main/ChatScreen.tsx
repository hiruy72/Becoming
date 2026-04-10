import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, DAYS_OF_WEEK } from '../../store/useStore';
import { theme } from '../../theme/theme';
import { Send, User as UserIcon, Brain } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'future-self';
  timestamp: number;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { user, weeklyPlan, chatHistory, addChatMessage } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatHistory.length > 0) {
      setMessages(chatHistory);
    } else {
      const welcomeMsg: Message = {
        id: '1',
        text: `Hey ${user?.name || 'there'}. I'm the version of you that made it — a ${user?.chosenIdentity || 'champion'}.\n\nI know your goals and weaknesses. Talk to me whenever you need direction.`,
        sender: 'future-self',
        timestamp: Date.now(),
      };
      setMessages([welcomeMsg]);
      addChatMessage(welcomeMsg);
    }
  }, []);

  const getWeeklyPlanContext = () => {
    const planSummary = DAYS_OF_WEEK.map(day => {
      const tasks = weeklyPlan[day] || [];
      if (tasks.length === 0) return null;
      const completed = tasks.filter(t => t.completed).length;
      const taskList = tasks.map(t => `  ${t.completed ? '✓' : '✗'} ${t.text}`).join('\n');
      return `${day} (${completed}/${tasks.length}):\n${taskList}`;
    }).filter(Boolean).join('\n');
    return planSummary || 'No weekly plan set yet.';
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const newUserMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);
    addChatMessage(newUserMsg);
    setInputText('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are the future version of ${user?.name || 'this person'}. 10 years older, successful, achieved "${user?.chosenIdentity || 'best self'}".
User goals: ${user?.goals?.join(', ') || 'Not set'}. Weaknesses: ${user?.habits?.join(', ') || 'Not set'}.
Weekly plan:\n${getWeeklyPlanContext()}
Be direct, honest, tough love. Reference their actual data. Keep responses concise (2-4 sentences).`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-10).map(m => ({ role: m.sender === 'user' ? 'user' as const : 'assistant' as const, content: m.text })),
            { role: 'user' as const, content: newUserMsg.text }
          ],
          max_tokens: 200,
        })
      });
      const data = await response.json();
      const replyText = data.choices?.[0]?.message?.content?.trim() || "Stay focused.";
      const replyMsg: Message = { id: (Date.now() + 1).toString(), text: replyText, sender: 'future-self', timestamp: Date.now() };
      setMessages(prev => [...prev, replyMsg]);
      addChatMessage(replyMsg);
    } catch {
      const errMsg: Message = { id: (Date.now() + 1).toString(), text: "Connection issue. Stay disciplined regardless.", sender: 'future-self', timestamp: Date.now() };
      setMessages(prev => [...prev, errMsg]);
      addChatMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
        {!isUser && (
          <View style={styles.botAvatarWrap}>
            <UserIcon color={theme.colors.primary} size={18} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerAvatarWrap}>
            <UserIcon color={theme.colors.primary} size={22} />
          </View>
          <View>
            <Text style={styles.headerName}>Future {user?.name || 'You'}</Text>
            <Text style={styles.headerSub}>{isLoading ? 'typing...' : 'Online'}</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={theme.colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.sendBtnOff]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerAvatarWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
  },
  headerName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  headerSub: { fontSize: 12, color: theme.colors.success, marginTop: 1 },

  chatList: { padding: 16, paddingBottom: 8 },

  bubbleRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  bubbleRowUser: { justifyContent: 'flex-end' },
  botAvatarWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center', alignItems: 'center', marginBottom: 2, overflow: 'hidden'
  },

  bubble: { maxWidth: '78%', padding: 14, borderRadius: 18 },
  userBubble: { backgroundColor: theme.colors.surfaceDark, borderBottomRightRadius: 6 },
  botBubble: { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 6, ...theme.shadow.soft },
  bubbleText: { fontSize: 15, lineHeight: 22, color: theme.colors.text },
  userBubbleText: { color: '#fff' },

  inputBar: {
    flexDirection: 'row', padding: 12, gap: 10, alignItems: 'flex-end',
    backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 12 : 24,
  },
  input: {
    flex: 1, backgroundColor: theme.colors.background, borderRadius: 22,
    paddingHorizontal: 18, paddingVertical: 12, maxHeight: 100,
    fontSize: 15, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnOff: { backgroundColor: theme.colors.border },
});
