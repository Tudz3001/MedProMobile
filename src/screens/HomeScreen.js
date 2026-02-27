import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { useApp } from '../hooks/useAppContext';
import { SCHEDULE_MAP } from '../data/medicineDb';
import { FS } from '../utils/theme';

// ── Helpers ───────────────────────────────────────────────────────────
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatCountdown(diffMin) {
  if (diffMin < 60) return `${diffMin} phút`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `${h}g${m > 0 ? m + 'p' : ''}`;
}

// ── Schedule Card ─────────────────────────────────────────────────────
function ScheduleCard({ entry, isPast, isNext, isTaken, onToggle, colors }) {
  const borderColor = isTaken ? colors.success
    : isNext ? colors.success
    : isPast ? colors.border
    : colors.accent;

  const bg = isTaken ? colors.takenbg
    : isNext ? colors.takenbg
    : isPast ? colors.panel
    : colors.futurebg;

  const timeColor = isTaken ? colors.success
    : isPast ? colors.muted
    : isNext ? colors.success
    : colors.accent;

  const nameColor = isTaken ? colors.success
    : isPast ? colors.muted
    : colors.text;

  const details = [entry.dose, entry.instruction, entry.duration]
    .filter(Boolean).join('  ·  ');

  return (
    <View style={[styles.schedCard, { backgroundColor: bg, borderColor }]}>
      <Text style={[styles.schedTime, { color: timeColor }]}>{entry.time}</Text>
      <View style={[styles.schedSep, { backgroundColor: borderColor }]} />
      <View style={styles.schedInfo}>
        <Text style={[
          styles.schedName,
          { color: nameColor },
          isTaken && styles.strikethrough,
        ]}>
          {entry.medicine}
        </Text>
        {details ? (
          <Text style={[styles.schedDetail, { color: colors.muted }]}>{details}</Text>
        ) : null}
        {isTaken && (
          <View style={[styles.doneBadge, { borderColor: colors.success }]}>
            <Text style={[styles.doneBadgeText, { color: colors.success }]}>✓ Đã uống</Text>
          </View>
        )}
        {isNext && !isTaken && (
          <View style={[styles.nextBadge, { borderColor: colors.success }]}>
            <Text style={[styles.nextBadgeText, { color: colors.success }]}>TIẾP THEO</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.takenBtn,
          isTaken
            ? { borderColor: colors.border }
            : { borderColor: colors.success, backgroundColor: colors.takenbg },
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.takenBtnText,
          { color: isTaken ? colors.muted : colors.success },
        ]}>
          {isTaken ? '↩ Bỏ' : '✓ Đã uống'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Medicine List Card ────────────────────────────────────────────────
function MedCard({ med, index, onEdit, onDelete, colors }) {
  const detail = `${med.dose || ''}  ·  ${med.frequency || 2} lần/ngày`
    + (med.duration ? `  ·  ${med.duration}` : '');

  return (
    <View style={[styles.medCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.medInfo}>
        <Text style={[styles.medName, { color: colors.text }]}>{med.name}</Text>
        <Text style={[styles.medDetail, { color: colors.muted }]}>{detail.trim()}</Text>
      </View>
      <TouchableOpacity onPress={() => onEdit(index)} style={styles.iconBtn} activeOpacity={0.7}>
        <Text style={[styles.iconBtnText, { color: colors.muted }]}>⏰</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(index)} style={styles.iconBtn} activeOpacity={0.7}>
        <Text style={[styles.iconBtnText, { color: colors.danger }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { medicines, taken, toggleTaken, deleteMedicine, colors } = useApp();

  const today = getTodayStr();
  const nowMin = getNowMinutes();

  // Build today schedule
  const schedule = useMemo(() => {
    const entries = [];
    for (const med of medicines) {
      const times = med.custom_times || SCHEDULE_MAP[med.frequency] || SCHEDULE_MAP[2];
      for (const t of times) {
        entries.push({
          time: t,
          medicine: med.name,
          dose: med.dose || '',
          instruction: med.instruction || '',
          duration: med.duration || '',
        });
      }
    }
    return entries.sort((a, b) => a.time.localeCompare(b.time));
  }, [medicines]);

  // Next dose info
  const nextEntry = useMemo(() => {
    let found = null;
    for (const entry of schedule) {
      const key = `${entry.medicine}@${entry.time}@${today}`;
      if (!taken[key] && timeToMinutes(entry.time) > nowMin) {
        found = entry;
        break;
      }
    }
    return found;
  }, [schedule, taken, today, nowMin]);

  const allTaken = schedule.length > 0 && schedule.every(e => taken[`${e.medicine}@${e.time}@${today}`]);

  const handleDelete = (index) => {
    Alert.alert(
      'Xóa thuốc',
      `Xóa "${medicines[index].name}" khỏi danh sách?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => deleteMedicine(index) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.dark }]}>
      <StatusBar barStyle={colors === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.panel} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.panel, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerLogo, { color: colors.text }]}>💊 MedPro</Text>
        <Text style={[styles.headerDate, { color: colors.muted }]}>
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Next dose banner */}
        {allTaken ? (
          <View style={[styles.nextBanner, { backgroundColor: colors.takenbg, borderColor: colors.success }]}>
            <Text style={[styles.nextBannerText, { color: colors.success }]}>
              ✅  Đã uống đủ thuốc hôm nay!
            </Text>
          </View>
        ) : nextEntry ? (
          <View style={[styles.nextBanner, { backgroundColor: colors.futurebg, borderColor: colors.accent }]}>
            <Text style={[styles.nextBannerText, { color: colors.accent }]}>
              ⏰  {nextEntry.medicine}  ·  {nextEntry.time}
              {'  '}
              <Text style={{ color: colors.muted, fontSize: FS.detail }}>
                còn {formatCountdown(timeToMinutes(nextEntry.time) - nowMin)}
              </Text>
            </Text>
          </View>
        ) : null}

        {/* Today schedule */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🕐 Lịch hôm nay</Text>

        {schedule.length === 0 ? (
          <View style={[styles.emptyBox, { borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Chưa có lịch uống thuốc{'\n'}Thêm thuốc để bắt đầu 📋
            </Text>
          </View>
        ) : schedule.map((entry, i) => {
          const key = `${entry.medicine}@${entry.time}@${today}`;
          const isPast = timeToMinutes(entry.time) < nowMin;
          const isTaken = !!taken[key];
          const isNext = entry === nextEntry && !isTaken;
          return (
            <ScheduleCard
              key={`${key}_${i}`}
              entry={entry}
              isPast={isPast}
              isNext={isNext}
              isTaken={isTaken}
              onToggle={() => toggleTaken(key)}
              colors={colors}
            />
          );
        })}

        {/* Medicine list */}
        <View style={styles.medHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
            📋 Danh sách thuốc
          </Text>
          <Text style={[styles.medCount, { color: colors.muted }]}>{medicines.length} thuốc</Text>
        </View>

        {medicines.length === 0 ? (
          <View style={[styles.emptyBox, { borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Chưa có thuốc nào{'\n'}Nhấn ＋ để thêm thuốc
            </Text>
          </View>
        ) : medicines.map((med, i) => (
          <MedCard
            key={`${med.name}_${i}`}
            med={med}
            index={i}
            onEdit={(idx) => navigation.navigate('EditTimes', { index: idx })}
            onDelete={handleDelete}
            colors={colors}
          />
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB buttons */}
      <View style={styles.fabRow}>
        <TouchableOpacity
          style={[styles.fabSecondary, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('SymptomSearch')}
          activeOpacity={0.8}
        >
          <Text style={[styles.fabSecondaryText, { color: colors.accent }]}>🔎 Triệu chứng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('AddMedicine', {})}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>＋ Thêm thuốc</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLogo: { fontSize: FS.title, fontWeight: '900' },
  headerDate: { fontSize: FS.detail, marginTop: 2 },
  scroll: { padding: 16 },
  sectionTitle: { fontSize: FS.header, fontWeight: '800', marginBottom: 12, marginTop: 8 },
  medHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 20, marginBottom: 12,
  },
  medCount: { fontSize: FS.detail },

  // Next banner
  nextBanner: {
    borderRadius: 14, borderWidth: 1.5,
    padding: 14, marginBottom: 16,
  },
  nextBannerText: { fontSize: FS.body, fontWeight: '700' },

  // Empty state
  emptyBox: {
    borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed',
    padding: 32, alignItems: 'center', marginBottom: 12,
  },
  emptyText: { fontSize: FS.body, textAlign: 'center', lineHeight: 26 },

  // Schedule card
  schedCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5,
    padding: 14, marginBottom: 10, gap: 12,
  },
  schedTime: { fontSize: FS.title, fontWeight: '800', fontVariant: ['tabular-nums'], width: 58 },
  schedSep: { width: 2, height: 44, borderRadius: 1 },
  schedInfo: { flex: 1 },
  schedName: { fontSize: FS.header, fontWeight: '700' },
  strikethrough: { textDecorationLine: 'line-through' },
  schedDetail: { fontSize: FS.detail, marginTop: 2 },
  doneBadge: {
    borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
    alignSelf: 'flex-start', marginTop: 4,
  },
  doneBadgeText: { fontSize: FS.small, fontWeight: '700' },
  nextBadge: {
    borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
    alignSelf: 'flex-start', marginTop: 4,
  },
  nextBadgeText: { fontSize: FS.small, fontWeight: '700' },
  takenBtn: {
    borderRadius: 10, borderWidth: 1.5,
    paddingHorizontal: 12, paddingVertical: 8, minWidth: 88,
    alignItems: 'center',
  },
  takenBtnText: { fontSize: FS.detail, fontWeight: '700' },

  // Med card
  medCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: FS.body, fontWeight: '700' },
  medDetail: { fontSize: FS.detail, marginTop: 2 },
  iconBtn: { padding: 8 },
  iconBtnText: { fontSize: 18 },

  // FAB
  fabRow: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    flexDirection: 'row', gap: 10,
  },
  fab: {
    flex: 1, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', elevation: 6,
  },
  fabText: { color: 'white', fontSize: FS.body, fontWeight: '700' },
  fabSecondary: {
    flex: 1, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1.5, elevation: 3,
  },
  fabSecondaryText: { fontSize: FS.body, fontWeight: '700' },
});
