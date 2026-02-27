import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../hooks/useAppContext';
import { searchMedicines } from '../data/medicineDb';
import { FS } from '../utils/theme';

export default function AddMedicineScreen({ navigation, route }) {
  const { addMedicine, colors } = useApp();
  const prefill = route.params?.prefill || null;

  const [name, setName] = useState(prefill?.name || '');
  const [dose, setDose] = useState(prefill?.common_dose || '');
  const [frequency, setFrequency] = useState(prefill?.max_per_day || 2);
  const [duration, setDuration] = useState('');
  const [instruction, setInstruction] = useState(prefill?.instruction || '');
  const [note, setNote] = useState('');
  const [warning, setWarning] = useState(prefill?.warning || '');
  const [interactions, setInteractions] = useState(prefill?.interactions || []);
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');

  const FREQ_OPTIONS = [
    { label: '1 lần/ngày  (07:00)', value: 1 },
    { label: '2 lần/ngày  (07:00 · 21:00)', value: 2 },
    { label: '3 lần/ngày  (07:00 · 13:00 · 20:00)', value: 3 },
    { label: '4 lần/ngày  (07:00 · 11:00 · 16:00 · 21:00)', value: 4 },
  ];

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim().length > 0) {
      setSearchResults(searchMedicines(text));
    } else {
      setSearchResults([]);
    }
  };

  const selectMed = (med) => {
    setName(med.name);
    setDose(med.common_dose);
    setFrequency(med.max_per_day > 4 ? 4 : med.max_per_day);
    setInstruction(med.instruction);
    setWarning(med.warning);
    setInteractions(med.interactions);
    setSearchText(med.name);
    setSearchResults([]);
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thuốc');
      return;
    }
    const medData = {
      name: name.trim(), dose: dose.trim(),
      frequency, duration: duration.trim(),
      instruction: instruction.trim(), note: note.trim(),
      warning, interactions,
    };
    await addMedicine(medData);
    navigation.goBack();
  };

  const inputStyle = [styles.input, {
    backgroundColor: colors.inputBg, borderColor: colors.border,
    color: colors.text,
  }];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.dark }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.panel, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.accent }]}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>➕ Thêm thuốc</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Search box */}
          <Text style={[styles.label, { color: colors.muted }]}>TÌM THUỐC</Text>
          <TextInput
            style={inputStyle}
            placeholder="🔍 Nhập tên thuốc (VD: Para, Amox...)"
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={handleSearch}
          />

          {/* Search dropdown */}
          {searchResults.length > 0 && (
            <View style={[styles.dropdown, { backgroundColor: colors.panel, borderColor: colors.accent }]}>
              {searchResults.map((med, i) => (
                <TouchableOpacity
                  key={med.name}
                  onPress={() => selectMed(med)}
                  style={[
                    styles.dropdownItem,
                    i < searchResults.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownName, { color: colors.text }]}>💊 {med.name}</Text>
                  <Text style={[styles.dropdownDetail, { color: colors.muted }]}>
                    {med.group}  ·  {med.common_dose}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.label, { color: colors.muted }]}>CHI TIẾT</Text>

          {/* Form */}
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Tên thuốc *</Text>
          <TextInput
            style={inputStyle}
            placeholder="Tên thuốc"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Liều lượng</Text>
          <TextInput
            style={inputStyle}
            placeholder="VD: 500mg, 1 viên"
            placeholderTextColor={colors.muted}
            value={dose}
            onChangeText={setDose}
          />

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Tần suất uống</Text>
          <View style={styles.freqRow}>
            {FREQ_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setFrequency(opt.value)}
                style={[
                  styles.freqBtn,
                  {
                    backgroundColor: frequency === opt.value ? colors.accent : colors.card,
                    borderColor: frequency === opt.value ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.freqBtnText,
                  { color: frequency === opt.value ? 'white' : colors.muted },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Thời gian điều trị</Text>
          <TextInput
            style={inputStyle}
            placeholder="VD: 7 ngày, 2 tuần"
            placeholderTextColor={colors.muted}
            value={duration}
            onChangeText={setDuration}
          />

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Hướng dẫn uống</Text>
          <TextInput
            style={inputStyle}
            placeholder="VD: Sau ăn, Trước ăn 30 phút"
            placeholderTextColor={colors.muted}
            value={instruction}
            onChangeText={setInstruction}
          />

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Ghi chú</Text>
          <TextInput
            style={inputStyle}
            placeholder="Ghi chú thêm (không bắt buộc)"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
          />

          {/* Warning box */}
          {warning ? (
            <View style={[styles.warnBox, { backgroundColor: colors.warnBg, borderColor: colors.warnBorder }]}>
              <Text style={[styles.warnText, { color: colors.warnText }]}>⚠️  {warning}</Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.cancelBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelBtnText, { color: colors.muted }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.addBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>✓  Thêm thuốc</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  label: { fontSize: FS.small, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  fieldLabel: { fontSize: FS.detail, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: FS.body,
  },
  dropdown: {
    borderWidth: 1.5, borderRadius: 12,
    marginTop: 4, overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12 },
  dropdownName: { fontSize: FS.body, fontWeight: '600' },
  dropdownDetail: { fontSize: FS.detail, marginTop: 2 },
  divider: { height: 1, marginVertical: 20 },
  freqRow: { gap: 8 },
  freqBtn: {
    borderWidth: 1.5, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  freqBtnText: { fontSize: FS.detail, fontWeight: '600' },
  warnBox: {
    borderWidth: 1, borderRadius: 10,
    padding: 14, marginTop: 16,
  },
  warnText: { fontSize: FS.detail, lineHeight: 22 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: FS.body, fontWeight: '600' },
  addBtn: {
    flex: 2, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  addBtnText: { color: 'white', fontSize: FS.body, fontWeight: '700' },
});
