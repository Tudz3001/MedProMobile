import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, FlatList,
} from 'react-native';
import { useApp } from '../hooks/useAppContext';
import { searchBySymptom, QUICK_TAGS } from '../data/medicineDb';
import { FS } from '../utils/theme';

function ResultCard({ med, query, onAdd, colors }) {
  const matched = med.symptoms.filter(s => {
    const q = query.toLowerCase();
    return s.toLowerCase().includes(q) || q.includes(s.toLowerCase());
  });
  const others = med.symptoms.filter(s => !matched.includes(s)).slice(0, 3);

  return (
    <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.resultTop}>
        <Text style={[styles.resultName, { color: colors.text }]}>{med.name}</Text>
        <View style={[styles.groupBadge, { borderColor: colors.accent }]}>
          <Text style={[styles.groupText, { color: colors.accent }]}>{med.group}</Text>
        </View>
      </View>
      <Text style={[styles.resultDose, { color: colors.muted }]}>
        Liều: {med.common_dose}  ·  {med.instruction}
      </Text>
      <View style={styles.tagRow}>
        {matched.slice(0, 4).map(s => (
          <View key={s} style={[styles.tag, { borderColor: colors.success }]}>
            <Text style={[styles.tagText, { color: colors.success }]}>{s}</Text>
          </View>
        ))}
        {others.slice(0, 2).map(s => (
          <View key={s} style={[styles.tag, { borderColor: colors.border }]}>
            <Text style={[styles.tagText, { color: colors.muted }]}>{s}</Text>
          </View>
        ))}
      </View>
      {med.warning ? (
        <Text style={[styles.warning, { color: colors.warning }]} numberOfLines={2}>
          ⚠ {med.warning}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.accent }]}
        onPress={() => onAdd(med)}
        activeOpacity={0.8}
      >
        <Text style={styles.addBtnText}>+ Thêm thuốc</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SymptomSearchScreen({ navigation }) {
  const { colors } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim()) setResults(searchBySymptom(text));
    else setResults([]);
  };

  const handleAdd = (med) => {
    navigation.navigate('AddMedicine', { prefill: med });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.dark }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.panel, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>🔎 Tìm theo triệu chứng</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        {/* Search input */}
        <View style={[styles.searchRow, { backgroundColor: colors.inputBg, borderColor: query ? colors.accent : colors.border }]}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="VD: đau đầu, sốt, ho, tiêu chảy..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={[styles.clearBtn, { color: colors.muted }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick tags */}
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>GỢI Ý NHANH:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
          {QUICK_TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              onPress={() => handleSearch(tag)}
              style={[
                styles.quickTag,
                {
                  backgroundColor: query === tag ? colors.accent : colors.card,
                  borderColor: query === tag ? colors.accent : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.quickTagText,
                { color: query === tag ? 'white' : colors.text },
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ width: 16 }} />
        </ScrollView>

        {/* Results */}
        {query.trim() ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>
              KẾT QUẢ: {results.length > 0 ? `${results.length} thuốc` : 'Không tìm thấy'}
            </Text>
            {results.length === 0 ? (
              <View style={[styles.emptyBox, { borderColor: colors.border }]}>
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  Không tìm thấy thuốc cho "{query}"{'\n'}Thử từ khóa khác nhé
                </Text>
              </View>
            ) : results.map((med, i) => (
              <ResultCard
                key={`${med.name}_${i}`}
                med={med}
                query={query}
                onAdd={handleAdd}
                colors={colors}
              />
            ))}
          </>
        ) : (
          <View style={[styles.emptyBox, { borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Nhập triệu chứng để tìm kiếm thuốc phù hợp 🔍
            </Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerTitle: { fontSize: FS.detail, fontWeight: '800' },
  scroll: { padding: 16 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4,
    gap: 8, marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: FS.body, paddingVertical: 10 },
  clearBtn: { fontSize: 18, paddingHorizontal: 4 },
  sectionLabel: {
    fontSize: FS.small, fontWeight: '700',
    letterSpacing: 1, marginBottom: 10, marginTop: 4,
  },
  tagsScroll: { marginBottom: 20, marginHorizontal: -16, paddingLeft: 16 },
  quickTag: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 8,
  },
  quickTagText: { fontSize: FS.detail, fontWeight: '600' },
  emptyBox: {
    borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed',
    padding: 32, alignItems: 'center',
  },
  emptyText: { fontSize: FS.body, textAlign: 'center', lineHeight: 26 },
  resultCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 16, marginBottom: 12,
  },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  resultName: { fontSize: FS.body, fontWeight: '800', flex: 1 },
  groupBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  groupText: { fontSize: FS.small, fontWeight: '600' },
  resultDose: { fontSize: FS.detail, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: FS.small },
  warning: { fontSize: FS.small, fontStyle: 'italic', marginBottom: 10, lineHeight: 18 },
  addBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  addBtnText: { color: 'white', fontSize: FS.body, fontWeight: '700' },
});
