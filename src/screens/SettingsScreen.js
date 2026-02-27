import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { useApp } from '../hooks/useAppContext';
import { checkInteractions } from '../data/medicineDb';
import { FS } from '../utils/theme';

function SettingRow({ icon, title, subtitle, right, onPress, colors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSub, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const {
    medicines, colors, theme, toggleTheme,
    clearAllMedicines,
  } = useApp();

  const interactions = checkInteractions(medicines.map(m => m.name));

  const handleClearAll = () => {
    Alert.alert(
      'Xóa tất cả thuốc',
      'Bạn có chắc muốn xóa toàn bộ danh sách thuốc?\nHành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa tất cả', style: 'destructive', onPress: clearAllMedicines },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.dark }]}>
      <View style={[styles.header, { backgroundColor: colors.panel, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>⚙️ Cài đặt</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Interaction warning */}
        {interactions.length > 0 && (
          <View style={[styles.warnCard, { backgroundColor: colors.warnBg, borderColor: colors.warnBorder }]}>
            <Text style={[styles.warnTitle, { color: colors.warnText }]}>⚠️ Cảnh báo tương tác thuốc</Text>
            {interactions.map((w, i) => (
              <Text key={i} style={[styles.warnItem, { color: colors.warnText }]}>{w}</Text>
            ))}
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>GIAO DIỆN</Text>

        <SettingRow
          icon={theme === 'dark' ? '☀️' : '🌙'}
          title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
          subtitle={`Hiện đang dùng chế độ ${theme === 'dark' ? 'tối' : 'sáng'}`}
          onPress={toggleTheme}
          colors={colors}
          right={
            <View style={[styles.toggleBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.toggleText}>Đổi</Text>
            </View>
          }
        />

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>HƯỚNG DẪN</Text>

        <SettingRow
          icon="❓"
          title="Xem lại hướng dẫn"
          subtitle="Hướng dẫn sử dụng từng bước"
          onPress={() => navigation.navigate('Tutorial')}
          colors={colors}
          right={<Text style={[styles.arrow, { color: colors.muted }]}>›</Text>}
        />

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>DỮ LIỆU</Text>

        <SettingRow
          icon="💊"
          title="Số thuốc đang dùng"
          subtitle={`${medicines.length} thuốc trong danh sách`}
          colors={colors}
        />

        <SettingRow
          icon="🗑"
          title="Xóa tất cả thuốc"
          subtitle="Xóa toàn bộ danh sách và thông báo"
          onPress={handleClearAll}
          colors={colors}
          right={<Text style={[styles.arrow, { color: colors.danger }]}>›</Text>}
        />

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>THÔNG TIN</Text>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>💊 MedPro</Text>
          <Text style={[styles.infoItem, { color: colors.muted }]}>Phiên bản: 1.0.0</Text>
          <Text style={[styles.infoItem, { color: colors.muted }]}>● Offline · Miễn phí · Bảo mật dữ liệu</Text>
          <Text style={[styles.infoItem, { color: colors.muted }]}>Dữ liệu lưu trên máy, không gửi đi đâu</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: FS.title, fontWeight: '900' },
  scroll: { padding: 16 },
  sectionLabel: {
    fontSize: FS.small, fontWeight: '700', letterSpacing: 1,
    marginTop: 24, marginBottom: 10,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 8, gap: 14,
  },
  rowIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: FS.body, fontWeight: '700' },
  rowSub: { fontSize: FS.detail, marginTop: 2 },
  toggleBadge: {
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  toggleText: { color: 'white', fontSize: FS.small, fontWeight: '700' },
  arrow: { fontSize: 24, fontWeight: '300' },
  warnCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 16, marginBottom: 8,
  },
  warnTitle: { fontSize: FS.body, fontWeight: '800', marginBottom: 8 },
  warnItem: { fontSize: FS.detail, lineHeight: 22, marginBottom: 4 },
  infoCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 16, gap: 6,
  },
  infoTitle: { fontSize: FS.header, fontWeight: '800', marginBottom: 4 },
  infoItem: { fontSize: FS.detail, lineHeight: 20 },
});
