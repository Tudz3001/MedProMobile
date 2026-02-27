import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Platform, Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useApp } from '../hooks/useAppContext';
import { SCHEDULE_MAP } from '../data/medicineDb';
import { FS } from '../utils/theme';

function TimeRow({ timeStr, onRemove, onEdit, colors }) {
  return (
    <View style={[styles.timeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.timeText, { color: colors.accent }]}>🕐  {timeStr}</Text>
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.editBtn, { borderColor: colors.accent }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.editBtnText, { color: colors.accent }]}>Đổi giờ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onRemove}
        style={[styles.removeBtn, { borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.removeBtnText, { color: colors.danger }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function EditTimesScreen({ navigation, route }) {
  const { medicines, updateMedicineTimes, colors } = useApp();
  const { index } = route.params;
  const med = medicines[index];

  const initTimes = med?.custom_times || SCHEDULE_MAP[med?.frequency || 2] || ['07:00'];
  const [times, setTimes] = useState([...initTimes]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [pickerDate, setPickerDate] = useState(new Date());

  if (!med) return null;

  const openPicker = (i) => {
    const [h, m] = times[i].split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    setPickerDate(d);
    setEditingIndex(i);
    setPickerOpen(true);
  };

  const addTime = () => {
    setTimes(prev => [...prev, '12:00']);
  };

  const removeTime = (i) => {
    if (times.length <= 1) {
      Alert.alert('Không thể xóa', 'Phải có ít nhất 1 khung giờ');
      return;
    }
    setTimes(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    const sorted = [...times].sort();
    await updateMedicineTimes(index, sorted);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.dark }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.panel, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>⏰ Chỉnh giờ uống</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.medName, { color: colors.text }]}>{med.name}</Text>
        <Text style={[styles.subLabel, { color: colors.muted }]}>Tùy chỉnh giờ uống thuốc</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>GIỜ UỐNG THUỐC</Text>

        {times.map((t, i) => (
          <TimeRow
            key={`${t}_${i}`}
            timeStr={t}
            onEdit={() => openPicker(i)}
            onRemove={() => removeTime(i)}
            colors={colors}
          />
        ))}

        <TouchableOpacity
          onPress={addTime}
          style={[styles.addTimeBtn, { borderColor: colors.accent }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.addTimeBtnText, { color: colors.accent }]}>＋ Thêm khung giờ</Text>
        </TouchableOpacity>

        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.cancelBtnText, { color: colors.muted }]}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>✓ Lưu giờ uống</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Time picker */}
      <DatePicker
        modal
        open={pickerOpen}
        date={pickerDate}
        mode="time"
        locale="vi"
        title="Chọn giờ uống thuốc"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={(date) => {
          setPickerOpen(false);
          const h = String(date.getHours()).padStart(2, '0');
          const m = String(date.getMinutes()).padStart(2, '0');
          const newTime = `${h}:${m}`;
          setTimes(prev => prev.map((t, i) => i === editingIndex ? newTime : t));
        }}
        onCancel={() => setPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  backBtn: { width: 80 },
  backText: { fontSize: FS.body, fontWeight: '600' },
  headerTitle: { fontSize: FS.header, fontWeight: '800' },
  scroll: { padding: 20 },
  medName: { fontSize: FS.title, fontWeight: '900', marginBottom: 4 },
  subLabel: { fontSize: FS.detail, marginBottom: 20 },
  divider: { height: 1, marginBottom: 16 },
  sectionLabel: { fontSize: FS.small, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  timeRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1.5,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 10, gap: 10,
  },
  timeText: { flex: 1, fontSize: FS.title, fontWeight: '800', fontVariant: ['tabular-nums'] },
  editBtn: {
    borderWidth: 1.5, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  editBtnText: { fontSize: FS.detail, fontWeight: '600' },
  removeBtn: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  removeBtnText: { fontSize: FS.detail, fontWeight: '700' },
  addTimeBtn: {
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 24,
  },
  addTimeBtnText: { fontSize: FS.body, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: FS.body, fontWeight: '600' },
  saveBtn: { flex: 2, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: 'white', fontSize: FS.body, fontWeight: '700' },
});
