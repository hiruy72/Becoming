import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useStore, DAYS_OF_WEEK } from '../../store/useStore';
import { TrendingUp, AlertTriangle, CheckCircle2, XCircle, BarChart3 } from 'lucide-react-native';

export default function ProgressScreen() {
  const { user, weeklyPlan } = useStore();

  const dayStats = DAYS_OF_WEEK.map(day => {
    const tasks = weeklyPlan[day] || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { day, total, completed, percent, tasks };
  });

  const totalTasks = dayStats.reduce((s, d) => s + d.total, 0);
  const totalDone = dayStats.reduce((s, d) => s + d.completed, 0);
  const overallPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const daysWithTasks = dayStats.filter(d => d.total > 0);
  const bestDay = daysWithTasks.reduce((b, d) => d.percent > (b?.percent || -1) ? d : b, null as any);
  const worstDay = daysWithTasks.reduce((w, d) => d.percent < (w?.percent || 101) ? d : w, null as any);

  const incompleteTasks: { day: string; text: string }[] = [];
  dayStats.forEach(d => {
    d.tasks.filter(t => !t.completed).forEach(t => {
      incompleteTasks.push({ day: d.day, text: t.text });
    });
  });

  const isSunday = new Date().getDay() === 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>Tracking your weekly discipline</Text>
          </View>
          <View style={styles.headerIcon}>
            <BarChart3 color={theme.colors.primary} size={22} />
          </View>
        </View>

        {/* Hero Score Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>Weekly Completion</Text>
            <Text style={styles.heroScore}>{overallPercent}%</Text>
            <Text style={styles.heroSub}>{totalDone} of {totalTasks} items completed</Text>
          </View>
          <View style={styles.heroCircle}>
            <View style={[styles.heroCircleFill, { height: `${overallPercent}%` }]} />
            <Text style={styles.heroCircleText}>{overallPercent}%</Text>
          </View>
        </View>

        {/* Analytics Grid */}
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <View style={[styles.gridIcon, { backgroundColor: theme.colors.successLight }]}>
              <TrendingUp color={theme.colors.success} size={18} />
            </View>
            <Text style={styles.gridLabel}>Best Performance</Text>
            {bestDay ? (
              <>
                <Text style={styles.gridValue}>{bestDay.day}</Text>
                <Text style={styles.gridSub}>{bestDay.percent}% score</Text>
              </>
            ) : <Text style={styles.gridValue}>—</Text>}
          </View>

          <View style={styles.gridCard}>
            <View style={[styles.gridIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <AlertTriangle color={theme.colors.error} size={18} />
            </View>
            <Text style={styles.gridLabel}>Needs Focus</Text>
            {worstDay && worstDay.day !== bestDay?.day ? (
              <>
                <Text style={styles.gridValue}>{worstDay.day}</Text>
                <Text style={styles.gridSub}>{worstDay.percent}% score</Text>
              </>
            ) : <Text style={styles.gridValue}>None</Text>}
          </View>
        </View>

        {/* Daily Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Breakdown</Text>
          {dayStats.map((d, i) => (
            <View key={d.day} style={[styles.dayRow, i === dayStats.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayName}>{d.day.slice(0, 3)}</Text>
                <Text style={styles.dayCount}>{d.total > 0 ? `${d.completed}/${d.total}` : '-'}</Text>
              </View>
              <View style={styles.dayBarTrack}>
                <View style={[
                  styles.dayBarFill, 
                  { width: d.total > 0 ? `${d.percent}%` : '0%' },
                  d.percent === 100 && { backgroundColor: theme.colors.success }
                ]} />
              </View>
              <Text style={styles.dayPercent}>{d.total > 0 ? `${d.percent}%` : ''}</Text>
            </View>
          ))}
        </View>

        {/* Still Pending */}
        {incompleteTasks.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Items to Finish</Text>
            {incompleteTasks.slice(0, 5).map((item, idx) => (
              <View key={idx} style={styles.pendingRow}>
                <View style={styles.pendingDot} />
                <Text style={styles.pendingDay}>{item.day.slice(0, 3)}</Text>
                <Text style={styles.pendingText} numberOfLines={1}>{item.text}</Text>
              </View>
            ))}
            {incompleteTasks.length > 5 && (
              <Text style={styles.moreText}>+{incompleteTasks.length - 5} more items</Text>
            )}
          </View>
        )}

        {/* Weekly Insights (Sunday only / if data exists) */}
        {totalTasks > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <BarChart3 color="#fff" size={20} />
              <Text style={styles.summaryTitle}>Future You Review</Text>
            </View>
            <Text style={styles.summaryText}>
              {overallPercent >= 80 
                ? "You've shown exceptional discipline this week. Your consistency is building the life I now live. Keep this intensity."
                : overallPercent >= 50
                  ? "A solid week, but there's room for improvement. Don't let comfort breed mediocrity. Push harder next week."
                  : "This week wasn't your best. Remember: your current habits are the architect of your future. Let's redirect."
              }
            </Text>
            <View style={styles.summaryFooter}>
              <Text style={styles.summaryFooterText}>Weekly analysis updated</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
  headerIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.borderLight,
    justifyContent: 'center', alignItems: 'center',
  },

  heroCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large,
    padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, ...theme.shadow.card,
  },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroScore: { fontSize: 42, fontWeight: '800', color: theme.colors.primary, marginVertical: 4 },
  heroSub: { fontSize: 13, color: theme.colors.textMuted },
  heroCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.background,
    justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.borderLight,
  },
  heroCircleFill: { width: '100%', backgroundColor: theme.colors.accent, position: 'absolute', bottom: 0 },
  heroCircleText: { fontSize: 14, fontWeight: '800', color: theme.colors.primary, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 4, width: '100%', textAlign: 'center', paddingVertical: 2 },

  grid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  gridCard: {
    flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large,
    padding: 16, ...theme.shadow.soft,
  },
  gridIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridLabel: { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  gridValue: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  gridSub: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large,
    padding: 20, marginBottom: 20, ...theme.shadow.soft,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text, marginBottom: 16 },

  dayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  dayInfo: { width: 50 },
  dayName: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  dayCount: { fontSize: 11, color: theme.colors.textMuted },
  dayBarTrack: { flex: 1, height: 8, backgroundColor: theme.colors.borderLight, borderRadius: 4, marginHorizontal: 10, overflow: 'hidden' },
  dayBarFill: { height: '100%', backgroundColor: theme.colors.accent, borderRadius: 4 },
  dayPercent: { width: 40, textAlign: 'right', fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },

  pendingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  pendingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.error },
  pendingDay: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary, width: 30 },
  pendingText: { flex: 1, fontSize: 14, color: theme.colors.text },
  moreText: { fontSize: 12, color: theme.colors.textMuted, textAlign: 'center', marginTop: 8 },

  summaryCard: {
    backgroundColor: theme.colors.surfaceDark, borderRadius: theme.borderRadius.large,
    padding: 24, ...theme.shadow.card,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  summaryText: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 24 },
  summaryFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: 20, paddingTop: 12 },
  summaryFooterText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },
});
